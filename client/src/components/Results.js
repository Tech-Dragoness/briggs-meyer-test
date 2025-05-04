import React, { useState, useEffect } from 'react';
import questions from '../questions';

function Results({ answers }) {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);
  const [retrying, setRetrying] = useState(false);

  const processAnswers = async () => {
    setLoading(true);
    setProgress(0);
    setError(null);
    setRetrying(false);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    try {
      let points = { E: 0, I: 0, N: 0, S: 0, T: 0, F: 0, J: 0, P: 0 };
      let letterAssignments = Array(questions.length).fill(null);

      // Step 1: Process numerical answers
      Object.entries(answers).forEach(([qid, { score, written }]) => {
        const question = questions[parseInt(qid)];
        if (score !== null && !written) {
          const letters = [];
          const scoring = question.scoring;
          for (const [letter, [min, max]] of Object.entries(scoring)) {
            if (score >= min && score <= max) {
              letters.push(letter);
            }
          }
          letterAssignments[parseInt(qid)] = letters;
          letters.forEach(letter => {
            points[letter] += 1;
          });
        }
      });

      // Step 2: Process written answers in batches of 5
      const writtenAnswers = Object.entries(answers)
        .filter(([qid, { written }]) => written && written.trim() !== '')
        .map(([qid, { written }]) => ({
          qid: parseInt(qid),
          question: questions[parseInt(qid)].text,
          answer: written,
          mbti: questions[parseInt(qid)].mbti
        }));

      for (let i = 0; i < writtenAnswers.length; i += 5) {
        const batch = writtenAnswers.slice(i, i + 5);
        const response = await fetch('https://briggs-meyer-test.onrender.com/api/analyze-written', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ batch })
        });
        if (!response.ok) throw new Error('Failed to analyze written answers');
        const batchResults = await response.json();
        batchResults.forEach((letters, idx) => {
          const { qid } = batch[idx];
          letterAssignments[qid] = Array.isArray(letters) ? letters : [letters];
          (Array.isArray(letters) ? letters : [letters]).forEach(letter => {
            points[letter] += 1;
          });
        });
      }

      // Step 3: Break ties using AI
      const pairs = [
        { letters: ['E', 'I'], points: [points.E, points.I] },
        { letters: ['N', 'S'], points: [points.N, points.S] },
        { letters: ['T', 'F'], points: [points.T, points.F] },
        { letters: ['J', 'P'], points: [points.J, points.P] }
      ];

      const ties = pairs
        .map(({ letters, points: [p1, p2] }, idx) => {
          if (p1 === p2 && p1 !== 0) {
            return { pair: idx, letters };
          }
          return null;
        })
        .filter(tie => tie !== null);

      if (ties.length > 0) {
        const tieData = ties.map(({ pair, letters }) => {
          const [letter1, letter2] = letters;
          const relevantAnswers = letterAssignments
            .map((assignedLetters, qid) => {
              if (assignedLetters && assignedLetters.some(l => l === letter1 || l === letter2)) {
                return { qid, answer: answers[qid], assignedLetters };
              }
              return null;
            })
            .filter(item => item !== null);
          return { pair: pairs[pair], relevantAnswers };
        });

        const response = await fetch('https://briggs-meyer-test.onrender.com/api/break-ties', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ties: tieData })
        });
        if (!response.ok) throw new Error('Failed to break ties');
        const tieResults = await response.json();
        tieResults.forEach(({ pair, letter }, idx) => {
          const pairData = pairs[pairs.findIndex(p => p.letters[0] === tieData[idx].pair.letters[0])];
          const otherLetter = pairData.letters[0] === letter ? pairData.letters[1] : pairData.letters[0];
          points[letter] += 1;
          console.log(`Tie broken for ${pairData.letters.join('/')}: Chose ${letter}, Points: ${letter}: ${points[letter]}, ${otherLetter}: ${points[otherLetter]}`);
        });
      }

      // Step 4: Determine MBTI type
      const mbtiType = [
        points.E >= points.I ? 'E' : 'I',
        points.N >= points.S ? 'N' : 'S',
        points.T >= points.F ? 'T' : 'F',
        points.J >= points.P ? 'J' : 'P'
      ].join('');

      // Step 5: Calculate percentages
      const percentages = {
        EI: {
          E: calcPercentage(points.E, points.I),
          I: calcPercentage(points.I, points.E)
        },
        NS: {
          N: calcPercentage(points.N, points.S),
          S: calcPercentage(points.S, points.N)
        },
        TF: {
          T: calcPercentage(points.T, points.F),
          F: calcPercentage(points.F, points.T)
        },
        JP: {
          J: calcPercentage(points.J, points.P),
          P: calcPercentage(points.P, points.J)
        }
      };

      // Step 6: Generate explanation
      const explanationResponse = await fetch('https://briggs-meyer-test.onrender.com/api/generate-explanation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: mbtiType, answers, points })
      });
      if (!explanationResponse.ok) throw new Error('Failed to generate explanation');
      const responseData = await explanationResponse.json();
      console.log('Explanation response from API:', responseData);
      const explanation = typeof responseData.explanation === 'string' ? responseData.explanation : 'No explanation provided.';
      console.log('Extracted explanation:', explanation);

      setResult({ type: mbtiType, explanation, percentages });
    } catch (error) {
      console.error('Error processing answers:', error);
      setError(error.message || 'An error occurred while processing your answers.');
      setResult(null);
    }
    setLoading(false);
    setRetrying(false);
    clearInterval(interval);
  };

  useEffect(() => {
    if (answers) {
      processAnswers();
    }
  }, [answers]);

  const handleRetry = () => {
    setRetrying(true);
    processAnswers();
  };

  const calcPercentage = (pointsA, pointsB) => {
    const total = pointsA + pointsB + 0.01;
    return Math.round((pointsA / total) * 100);
  };

  const extractPersonalityType = (type) => {
    if (!type) return 'Unknown';
    const mbtiPattern = /\b([EI][NS][TF][JP])\b/;
    const boldMbtiPattern = /\*\*([EI][NS][TF][JP])\*\*/;
    const boldMatch = type.match(boldMbtiPattern);
    if (boldMatch) return boldMatch[1];
    const plainMatch = type.match(mbtiPattern);
    if (plainMatch) return plainMatch[1];
    return 'Unknown';
  };

  const parseExplanation = (text) => {
    console.log('Parsing explanation:', text);
    if (!text || typeof text !== 'string') return <p className="text-gray-700">No explanation available.</p>;

    // Split the text into lines based on actual newlines (\n)
    const lines = text.split(/\n/).filter(line => line.trim() !== '');
    const elements = [];
    let inBulletList = false;

    lines.forEach((line, index) => {
      // Handle bold formatting within the line
      let formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

      // Check if the line is a bullet point
      if (formattedLine.trim().startsWith('* ')) {
        if (!inBulletList) {
          elements.push('<ul class="list-disc list-inside my-4">');
          inBulletList = true;
        }
        // Remove the "* " prefix and render as a list item
        const bulletText = formattedLine.trim().slice(2);
        elements.push(
          `<li key="bullet-${index}" class="text-gray-700">${bulletText}</li>`
        );
      } else {
        // Close the bullet list if we were in one
        if (inBulletList) {
          elements.push('</ul>');
          inBulletList = false;
        }
        // Render the line as a paragraph
        elements.push(
          `<p key="p-${index}" class="text-gray-700 mb-4">${formattedLine}</p>`
        );
      }
    });

    // Close any open bullet list at the end
    if (inBulletList) {
      elements.push('</ul>');
    }

    return <div className="leading-relaxed my-6" dangerouslySetInnerHTML={{ __html: elements.join('') }} />;
  };

  return (
    <div className="bg-white p-10 rounded-lg shadow-lg max-w-2xl w-full text-center">
      <style>
        {`
          @keyframes bounceIn {
            0% { transform: scale(0.8); opacity: 0; }
            60% { transform: scale(1.3); opacity: 1; }
            100% { transform: scale(1); }
          }
          @keyframes colorShift {
            0% { color: #f472b6; }
            33% { color: #c084fc; }
            66% { color: #60a5fa; }
            100% { color: #f472b6; }
          }
          .bounce-in {
            animation: bounceIn 0.8s ease-out;
          }
          .multicolor-text {
            font-size: 2.5rem;
            font-weight: bold;
            animation: colorShift 3s infinite, bounceIn 0.8s ease-out;
            display: inline-block;
            color: #f472b6;
          }
          .percentage-bar-container {
            position: relative;
            width: 100%;
          }
          .percentage-bar {
            height: 0.75rem;
            border-radius: 0.375rem;
            position: relative;
            overflow: hidden;
          }
          .percentage-label {
            position: absolute;
            top: -1.5rem;
            left: 50%;
            transform: translateX(-50%);
            font-size: 0.875rem;
            font-weight: bold;
            color: #f472b6;
            background: rgba(255, 255, 255, 0.8);
            padding: 0.1rem 0.4rem;
            border-radius: 0.25rem;
            z-index: 10;
          }
          .retry-button {
            background: linear-gradient(to right, #f472b6, #c084fc);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 0.5rem;
            font-weight: bold;
            transition: transform 0.2s;
            margin: 0.5rem;
          }
          .retry-button:hover {
            transform: scale(1.05);
          }
          .retry-button:disabled {
            background: #d1d5db;
            cursor: not-allowed;
          }
        `}
      </style>
      {loading || retrying ? (
        <div>
          <p className="text-xl text-pink-600 mb-4">{retrying ? 'Retrying...' : 'Analyzing your personality...'}</p>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div
              className="bg-gradient-to-r from-pink-500 to-purple-500 h-4 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 mt-2">{progress}%</p>
        </div>
      ) : error ? (
        <div>
          <p className="text-xl text-red-600 mb-4">Oops, something went wrong!</p>
          <p className="text-gray-700 mb-6">{error}</p>
          <button
            className="retry-button"
            onClick={handleRetry}
            disabled={retrying}
          >
            Retry Analysis
          </button>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl font-bold text-pink-600 mb-4 bounce-in">Your Personality Type</h2>
          <p className="multicolor-text mb-6" style={{ animationDelay: '0.2s' }}>
            {extractPersonalityType(result?.type)}
          </p>
          {result?.percentages && Object.keys(result.percentages).length > 0 && (
            <div className="mb-6 space-y-4">
              {Object.entries(result.percentages).map(([pair, { [pair[0]]: left, [pair[1]]: right }], idx) => {
                const typeLetters = result?.type?.split('') || [];
                const isLeftLetterInType = pair === 'EI' ? typeLetters[0] === pair[0] :
                                          pair === 'NS' ? typeLetters[1] === pair[0] :
                                          pair === 'TF' ? typeLetters[2] === pair[0] :
                                          typeLetters[3] === pair[0];
                const isRightLetterInType = pair === 'EI' ? typeLetters[0] === pair[1] :
                                           pair === 'NS' ? typeLetters[1] === pair[1] :
                                           pair === 'TF' ? typeLetters[2] === pair[1] :
                                           typeLetters[3] === pair[1];
                const leftColor = isLeftLetterInType ? '#f472b6' : '#93c5fd';
                const rightColor = isRightLetterInType ? '#f472b6' : '#93c5fd';
                console.log(`Rendering ${pair}:`, { left, right, label: `${left}% ${pair[0]}, ${right}% ${pair[1]}`, leftColor, rightColor });
                return (
                  <div key={pair} className="flex items-center space-x-4">
                    <span className="w-8 text-gray-700 font-bold">{pair[0]}</span>
                    <div className="flex-1 percentage-bar-container">
                      <div
                        className="percentage-bar"
                        style={{ background: `linear-gradient(to right, ${leftColor} ${left}%, ${rightColor} ${left}%)` }}
                      ></div>
                      <div className="percentage-label">{`${left}% ${pair[0]} | ${right}% ${pair[1]}`}</div>
                    </div>
                    <span className="w-8 text-gray-700 font-bold">{pair[1]}</span>
                  </div>
                );
              })}
            </div>
          )}
          {parseExplanation(result?.explanation)}
          {extractPersonalityType(result?.type) === 'Unknown' && (
            <button
              className="retry-button"
              onClick={handleRetry}
              disabled={retrying}
            >
              Retry Analysis
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default Results;
