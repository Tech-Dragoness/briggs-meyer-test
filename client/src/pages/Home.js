import React from 'react';

function Home({ startTest }) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-center">
      <h1 className="text-3xl font-bold text-pink-600 mb-4">Discover Your Personality</h1>
      <p className="text-gray-700 mb-6">
        Dive into our Briggs-Meyer test to uncover your unique personality type. <br></br><br></br> Answer with honesty, choosing what truly feels like you—or share your thoughts in words if the scale doesn’t capture your heart.
      </p>
      <button
        onClick={startTest}
        className="px-4 py-2 rounded transition-transform duration-300 bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:bg-gradient-to-r hover:from-pink-400 hover:to-purple-400 hover:scale-105 active:scale-95"
      >
        Start Test
      </button>
    </div>
  );
}

export default Home;