import React, { useState } from 'react';
import Question from '../components/Question';
import questions from '../questions';

function Test({ submitAnswers }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const handleAnswer = (questionId, answer) => {
    const updatedAnswers = { ...answers, [questionId]: answer };
    setAnswers(updatedAnswers);
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      submitAnswers(updatedAnswers);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl w-full">
      <h2 className="text-2xl font-bold text-pink-600 mb-4">
        Question {currentQuestion + 1} of {questions.length}
      </h2>
      <Question
        question={questions[currentQuestion]}
        onAnswer={handleAnswer}
        questionId={currentQuestion}
      />
    </div>
  );
}

export default Test;