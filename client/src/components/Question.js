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
        `}
      </style>
      <p className="text-lg text-gray-800 mb-4 text-center">{question.text}</p>
      {!question.writeOnly && (
        <div className="mb-4 w-full">
          <div className="flex justify-between mb-2">
            <span className="text-sm text-purple-600">
              {question.disagreeLabel || 'Totally disagree'}
            </span>
            <span className="text-sm text-purple-600">
              {question.agreeLabel || 'Totally agree'}
            </span>
          </div>
          <div className="flex gap-2 justify-center">
            {[...Array(10)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handleScoreChange(i + 1)}
                className={`px-4 py-2 rounded transition-transform duration-300 ${
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