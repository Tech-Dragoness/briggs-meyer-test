require('dotenv').config();
const express = require('express');
const cors = require('cors');
const NodeCache = require('node-cache');

// Dynamically import node-fetch since it's an ES Module
let fetch;
(async () => {
  const fetchModule = await import('node-fetch');
  fetch = fetchModule.default;
})();

const app = express();
const cache = new NodeCache({ stdTTL: 3600 });

app.use(cors());
app.use(express.json());

// Analyze written answers in batches
app.post('/api/analyze-written', async (req, res) => {
  const { batch } = req.body;
  const batchKey = JSON.stringify(batch);

  const cachedResult = cache.get(batchKey);
  if (cachedResult) {
    console.log('Returning cached written analysis:', cachedResult);
    return res.json(cachedResult);
  }

  try {
    const prompt = `
      Analyze the following written answers for a Briggs-Meyer personality test. For each answer, determine the primary MBTI letter (e.g., "E" or "I" for E/I) based on the mbti pair provided. If the answer strongly indicates another letter outside the mbti pair, include that as a secondary letter. Return an array where each element is either a single letter in quotes (e.g., "E") or an array of letters in quotes (e.g., ["E", "N"]) if both apply. Ensure primary letter matches the mbti pair (e.g., E/I, N/S, T/F, J/P).
      Answers: ${JSON.stringify(batch.map(({ qid, question, answer, mbti }) => ({
        qid,
        question,
        answer,
        mbti
      })))}
    `;
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const body = JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ],
      generationConfig: {
        temperature: 0,
        topP: 1,
        topK: 1,
        maxOutputTokens: 1000,
      }
    });

    console.log('Sending request to Gemini API:');
    console.log('URL:', url);
    console.log('Body:', body);

    // Ensure fetch is loaded before using it
    if (!fetch) {
      await new Promise(resolve => setTimeout(resolve, 100));
      if (!fetch) throw new Error('node-fetch not loaded');
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    console.log('Raw Gemini written response:', responseText);

    let parsedResult;
    try {
      // Remove Markdown code block if present
      const cleanedText = responseText.replace(/```json\n|\n```/g, '').trim();
      parsedResult = JSON.parse(cleanedText);
      parsedResult = parsedResult.map((item, idx) => {
        const { mbti } = batch[idx];
        const [primary, secondary] = mbti.split('/');
        if (typeof item === 'string' && (item === primary || item === secondary)) {
          return item;
        } else if (Array.isArray(item) && item.length > 0 && (item[0] === primary || item[0] === secondary)) {
          return item;
        }
        return primary;
      });
    } catch (parseError) {
      console.error('Failed to parse written response:', parseError);
      parsedResult = batch.map(({ mbti }) => mbti.split('/')[0]);
    }

    cache.set(batchKey, parsedResult);
    console.log('Returning written result:', parsedResult);
    res.json(parsedResult);
  } catch (error) {
    console.error('Error analyzing written answers:', error.message);
    const mockResult = batch.map(({ mbti }) => {
      const [primary, secondary] = mbti.split('/');
      return primary;
    });
    console.log('Returning mock result due to error:', mockResult);
    cache.set(batchKey, mockResult);
    res.json(mockResult);
  }
});

// Break ties between MBTI letters
app.post('/api/break-ties', async (req, res) => {
  const { ties } = req.body;
  const tiesKey = JSON.stringify(ties);

  const cachedResult = cache.get(tiesKey);
  if (cachedResult) {
    console.log('Returning cached tie-break result:', cachedResult);
    return res.json(cachedResult);
  }

  try {
    const prompt = `
      For each MBTI letter pair where there's a tie, choose one letter based on the provided answers. Return an array of objects with { pair: { letters: [letter1, letter2] }, letter: "chosenLetter" }.
      Ties: ${JSON.stringify(ties.map(({ pair, relevantAnswers }) => ({
        pair: pair.letters,
        relevantAnswers: relevantAnswers.map(({ qid, answer, assignedLetters }) => ({
          qid,
          answer: answer.score ? `Score: ${answer.score}` : answer.written,
          assignedLetters
        }))
      })))}
    `;
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const body = JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ],
      generationConfig: {
        temperature: 0,
        topP: 1,
        topK: 1,
        maxOutputTokens: 1000,
      }
    });

    console.log('Sending request to Gemini API for tie-breaking:');
    console.log('URL:', url);
    console.log('Body:', body);

    // Ensure fetch is loaded before using it
    if (!fetch) {
      await new Promise(resolve => setTimeout(resolve, 100));
      if (!fetch) throw new Error('node-fetch not loaded');
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    console.log('Raw Gemini tie-break response:', responseText);

    let parsedResult;
    try {
      // Remove Markdown code block and explanatory text
      const cleanedText = responseText
        .replace(/```javascript\n|\n```/g, '')
        .replace(/```json\n|\n```/g, '')
        .replace(/This code iterates.*$/s, '')
        .trim();
      // Extract the JSON array
      const jsonMatch = cleanedText.match(/\[.*\]/s);
      if (!jsonMatch) throw new Error('No JSON array found in response');
      const parsedJson = JSON.parse(jsonMatch[0]);
      parsedResult = parsedJson.map((item, idx) => {
        const { pair: { letters: [letter1, letter2] } } = ties[idx];
        // Validate the chosen letter
        if (item && item.pair && item.pair.letters && item.letter && (item.letter === letter1 || item.letter === letter2)) {
          return { pair: { letters: [letter1, letter2] }, letter: item.letter };
        }
        // Default to Gemini's choice if parsing fails, or use the second letter if tie persists
        const eCount = ties[idx].relevantAnswers.filter(answer => answer.assignedLetters.includes(letter1)).length;
        const iCount = ties[idx].relevantAnswers.filter(answer => answer.assignedLetters.includes(letter2)).length;
        const defaultLetter = eCount > iCount ? letter1 : letter2;
        return { pair: { letters: [letter1, letter2] }, letter: defaultLetter };
      });
    } catch (parseError) {
      console.error('Failed to parse tie-break response:', parseError);
      parsedResult = ties.map(({ pair: { letters: [letter1, letter2] } }) => {
        // Fallback to counting letters in answers
        const eCount = ties[0].relevantAnswers.filter(answer => answer.assignedLetters.includes(letter1)).length;
        const iCount = ties[0].relevantAnswers.filter(answer => answer.assignedLetters.includes(letter2)).length;
        const chosenLetter = eCount > iCount ? letter1 : letter2;
        return { pair: { letters: [letter1, letter2] }, letter: chosenLetter };
      });
    }

    cache.set(tiesKey, parsedResult);
    console.log('Returning tie-break result:', parsedResult);
    res.json(parsedResult);
  } catch (error) {
    console.error('Error breaking ties:', error.message);
    const mockResult = ties.map(({ pair: { letters: [letter1, letter2] } }) => {
      // Fallback to counting letters in answers
      const eCount = ties[0].relevantAnswers.filter(answer => answer.assignedLetters.includes(letter1)).length;
      const iCount = ties[0].relevantAnswers.filter(answer => answer.assignedLetters.includes(letter2)).length;
      const chosenLetter = eCount > iCount ? letter1 : letter2;
      return { pair: { letters: [letter1, letter2] }, letter: chosenLetter };
    });
    console.log('Returning mock tie-break result due to error:', mockResult);
    cache.set(tiesKey, mockResult);
    res.json(mockResult);
  }
});

// Generate explanation for final MBTI type
app.post('/api/generate-explanation', async (req, res) => {
  const { type, answers, points } = req.body;
  const explanationKey = JSON.stringify({ type, answers, points });

  const cachedResult = cache.get(explanationKey);
  if (cachedResult) {
    console.log('Returning cached explanation:', cachedResult);
    return res.json(cachedResult);
  }

  try {
    const prompt = `
      Generate a detailed explanation for the MBTI type "${type}" based on the following answers and points:
      Answers: ${JSON.stringify(answers)}
      Points: ${JSON.stringify(points)}
      Return a JSON object with "explanation" (a detailed explanation using * for bullet points and ** for bold text).
    `;
    
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
    const body = JSON.stringify({
      contents: [
        {
          parts: [
            { text: prompt }
          ]
        }
      ],
      generationConfig: {
        temperature: 0,
        topP: 1,
        topK: 1,
        maxOutputTokens: 1000,
      }
    });

    console.log('Sending request to Gemini API for explanation:');
    console.log('URL:', url);
    console.log('Body:', body);

    // Ensure fetch is loaded before using it
    if (!fetch) {
      await new Promise(resolve => setTimeout(resolve, 100));
      if (!fetch) throw new Error('node-fetch not loaded');
    }

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`API request failed: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    const responseText = data.candidates[0].content.parts[0].text;
    console.log('Raw Gemini explanation response:', responseText);

    let parsedResult;
    try {
      // Remove Markdown code block if present
      const cleanedText = responseText.replace(/```json\n|\n```/g, '').trim();
      const parsedJson = JSON.parse(cleanedText);
      if (!parsedJson.explanation || typeof parsedJson.explanation !== 'string') {
        throw new Error('Invalid explanation format in response');
      }
      console.log('Explanation after parsing:', parsedJson.explanation);
      parsedResult = { explanation: parsedJson.explanation };
      console.log('Explanation after assigning to parsedResult:', parsedResult.explanation);
    } catch (parseError) {
      console.error('Failed to parse explanation response:', parseError);
      const fallbackExplanation = responseText.replace(/```json\n|\n```/g, '').trim();
      console.log('Explanation after fallback parsing:', fallbackExplanation);
      parsedResult = { explanation: fallbackExplanation };
      console.log('Explanation after assigning to parsedResult (fallback):', parsedResult.explanation);
    }

    cache.set(explanationKey, parsedResult);
    console.log('Explanation before normalization:', parsedResult.explanation);
    // Normalize standalone \n concatenations just before sending the response
    parsedResult.explanation = parsedResult.explanation.replace(/(\n\s*)+/g, '\n\n');
    console.log('Explanation after final normalization:', parsedResult.explanation);
    res.json(parsedResult);
  } catch (error) {
    console.error('Error generating explanation:', error.message);
    const mockResult = {
      explanation: `Due to an error, here's a basic explanation for **${type}**:\n* This type reflects your answers.\n* Points: E:${points.E}, I:${points.I}, N:${points.N}, S:${points.S}, T:${points.T}, F:${points.F}, J:${points.J}, P:${points.P}`
    };
    console.log('Mock explanation before normalization:', mockResult.explanation);
    mockResult.explanation = mockResult.explanation.replace(/(\n\s*)+/g, '\n\n');
    console.log('Mock explanation after final normalization:', mockResult.explanation);
    cache.set(explanationKey, mockResult);
    res.json(mockResult);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
