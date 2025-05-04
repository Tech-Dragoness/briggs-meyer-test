const axios = require('axios');
require('dotenv').config();

const analyzeAnswers = async (answers) => {
  try {
    const prompt = `
      Analyze the following personality test answers and determine the MBTI type (e.g., INFJ, ESTP).
      Answers are either numerical (1-10) or written responses.
      Provide the four-letter MBTI type and a brief explanation.
      Answers: ${JSON.stringify(answers)}
    `;

    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': process.env.GEMINI_API_KEY,
        },
      }
    );

    const result = response.data.candidates[0].content.parts[0].text;
    const [type, ...explanation] = result.split('\n');
    return { type, explanation: explanation.join('\n') };
  } catch (error) {
    console.error('Error calling Gemini API:', error.message);
    throw new Error('Failed to analyze answers');
  }
};

module.exports = { analyzeAnswers };