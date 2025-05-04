import React from 'react';

function Button({ text, onClick, disabled = false, className = '' }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`px-6 py-2 rounded font-semibold transition-transform duration-300 ${
        disabled
          ? 'bg-gray-400 cursor-not-allowed'
          : 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:bg-gradient-to-r hover:from-pink-400 hover:to-purple-400 hover:scale-105 active:scale-95'
      } ${className}`}
    >
      {text}
    </button>
  );
}

export default Button;