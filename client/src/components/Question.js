import React, { useState, useEffect } from 'react';
import Button from './Button';

function Question({ question, onAnswer, questionId }) {
  const [score, setScore] = useState(null);
  const [writtenAnswer, setWrittenAnswer] = useState('');

  // Reset state when questionId changes (new question)
  useEffect(() => {
    setScore(null);
    setWrittenAnswer('');
  }, [questionId]);

  const handleScoreChange = (value) => {
    setScore(value);
    setWrittenAnswer(''); // Clear written answer
  };

  const handleWrittenChange = (e) => {
    const text = e.target.value;
    setWrittenAnswer(text);
    if (text.trim() !== '') {
      setScore(null); // Clear score if non-whitespace text
    }
  };

  const handleSubmit = () => {
    const answer = {
      score: writtenAnswer.trim() !== '' ? null : score,
      written: writtenAnswer
    };
    onAnswer(questionId, answer);
  };

  return (
    <div className="mb-6 flex flex-col items-center max-w-lg mx-auto">
      <style>
        {`
          @keyframes sparkle {
            0% { box-shadow: 0 0 5px rgba(255, 182, 193, 0.8), 0 0 10px rgba(255, 182, 193, 0.6); }
            50% { box-shadow: 0 0 15px rgba(192, 132, 252, 0.9), 0 0 20px rgba(192, 132, 252, 0.7); }
            100% { box-shadow: 0 0 5px rgba(255, 182, 193, 0.8), 0 0 10px rgba(255, 182, 193, 0.6); }
          }
          @keyframes borderGlow {
            0% { border-color: #f472b6; }
            33% { border-color: #c084fc; }
            66% { border-color: #60a5fa; }
            100% { border-color: #f472b6; }
          }
          .sparkle {
            animation: sparkle 1.5s infinite;
          }
          .glow-border:focus {
            animation: borderGlow 1.5s infinite;
            border-width: 2px;
          }
          .score-buttons {
            display: flex;
            gap: 0.5rem; /* Consistent gap for larger screens */
            justify-content: space-between; /* Spread buttons evenly */
            width: 100%; /* Ensure buttons take full width of container */
            flex-wrap: nowrap; /* Single line by default */
          }
          .score-buttons button {
            flex: 1; /* Buttons grow equally to fill space */
            max-width: 48px; /* Limit button width to prevent overflow */
            min-width: 36px; /* Ensure buttons don't shrink too much */
          }
          @media (max-width: 640px) {
            .score-buttons {
              flex-wrap: wrap; /* Allow wrapping on smaller screens */
              gap: 0.25rem; /* Smaller gap for tighter fit */
            }
            .score-buttons button {
              flex: 0 1 calc(20% - 0.2rem); /* 5 buttons per row, adjusted for gap */
              max-width: none; /* Remove max-width for better fit */
              min-width: 32px; /* Slightly smaller min-width for very small screens */
            }
            .score-buttons > div {
              width: 100%; /* Each row takes full width */
              display: flex;
              justify-content: space-between;
              gap: 0.25rem; /* Consistent gap within rows */
            }
            .labels-container {
              display: flex;
              flex-direction: column;
              gap: 0.5rem; /* Space between labels and buttons */
              width: 100%; /* Ensure full width for proper alignment */
            }
            .label-disagree {
              text-align: left;
              margin-bottom: 0.5rem;
            }
            .label-agree-container {
              display: flex;
              justify-content: flex-end; /* Align to the right */
              width: 100%; /* Ensure full width for proper alignment */
            }
            .label-agree {
              text-align: right;
              margin-top: 0.5rem; /* Space between second row and label */
            }
          }
        `}
      </style>
      <p className="text-lg text-gray-800 mb-4 text-center">{question.text}</p>
      {!question.writeOnly && (
        <div className="mb-4 w-full">
          <div className="labels-container">
            <div className="flex justify-between sm:flex-row">
              <span className="text-sm text-purple-600 label-disagree">
                {question.disagreeLabel || 'Totally disagree'}
              </span>
              <span className="text-sm text-purple-600 label-agree sm:block hidden">
                {question.agreeLabel || 'Totally agree'}
              </span>
            </div>
          </div>
          <div className="score-buttons">
            {[...Array(10)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handleScoreChange(i + 1)}
                className={`px-2 py-1 rounded transition-transform duration-300 ${
                  score === i + 1 && writtenAnswer.trim() === ''
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white sparkle hover:scale-105'
                    : writtenAnswer.trim() !== ''
                    ? 'bg-gray-300 cursor-not-allowed'
                    : 'bg-gray-200 hover:bg-gradient-to-r hover:from-pink-400 hover:to-pink-300 hover:scale-105'
                }`}
                disabled={writtenAnswer.trim() !== ''}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <div className="labels-container">
            <div className="label-agree-container block sm:hidden">
              <span className="text-sm text-purple-600 label-agree">
                {question.agreeLabel || 'Totally agree'}
              </span>
            </div>
          </div>
        </div>
      )}
      <textarea
        value={writtenAnswer}
        onChange={handleWrittenChange}
        placeholder={question.writeOnly ? 'Write your answer here...' : 'Optional: Write your answer...'}
        className="w-full p-2 border rounded focus:outline-none focus:ring-3 focus:ring-blue-500 glow-border mb-4"
        rows="4"
      />
      <Button
        text="Submit"
        onClick={handleSubmit}
        disabled={score === null && writtenAnswer.trim() === ''}
      />
    </div>
  );
}

export default Question;
