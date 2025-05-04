import React, { useState } from 'react';
import Home from './pages/Home';
import Test from './pages/Test';
import Results from './components/Results';

function App() {
  const [page, setPage] = useState('home');
  const [answers, setAnswers] = useState({});

  const startTest = () => setPage('test');
  const submitAnswers = (finalAnswers) => {
    setAnswers(finalAnswers);
    setPage('results');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 flex items-center justify-center p-4">
      {page === 'home' && <Home startTest={startTest} />}
      {page === 'test' && <Test submitAnswers={submitAnswers} />}
      {page === 'results' && <Results answers={answers} />}
    </div>
  );
}

export default App;