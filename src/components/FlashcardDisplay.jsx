import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';

const FlashcardDisplay = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (!cards || cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-8">
        <div className="text-6xl mb-4 opacity-20">📚</div>
        <p className="text-slate-500 text-lg font-medium">No flashcards generated yet.</p>
        <p className="text-slate-400 text-sm mt-2">Create some flashcards to get started!</p>
      </div>
    );
  }

  const currentCard = cards[currentIndex];

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
    setShowAnswer(false);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + cards.length) % cards.length);
    setShowAnswer(false);
  };

  const handleReset = () => {
    setShowAnswer(false);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-slate-600">Progress</span>
          <span className="text-sm font-bold text-slate-800">
            {currentIndex + 1} of {cards.length}
          </span>
        </div>
        <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Flashcard Container */}
      <div className="relative mb-8">
        <div
          className="relative w-full min-h-[320px] cursor-pointer group"
          onClick={() => setShowAnswer(!showAnswer)}
        >
          {/* Card Shadow/Depth Effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-200 to-cyan-300 rounded-3xl transform rotate-1 opacity-30 group-hover:rotate-2 transition-transform duration-300" />
          <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 rounded-3xl transform -rotate-1 opacity-20 group-hover:-rotate-2 transition-transform duration-300" />
          
          {/* Main Card */}
          <div className="relative perspective-1000">
            <div
              className={`w-full h-full transition-all duration-700 transform-style-3d ${
                showAnswer ? 'rotate-y-180' : ''
              }`}
            >
              {/* Front of card (Question) */}
              <div className="absolute w-full min-h-[320px] backface-hidden bg-gradient-to-br from-white via-slate-50 to-blue-50 rounded-3xl shadow-2xl border border-white/50 p-8 flex flex-col items-center justify-center text-center backdrop-blur-sm">
                <div className="absolute top-4 left-4 w-3 h-3 bg-blue-400 rounded-full opacity-60" />
                <div className="absolute top-4 left-10 w-2 h-2 bg-cyan-400 rounded-full opacity-40" />
                <div className="absolute bottom-4 right-4 w-4 h-4 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-full opacity-30" />
                
                <div className="mb-4 text-blue-500 opacity-60">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <p className="text-2xl font-bold text-slate-800 leading-relaxed max-w-md">
                  {currentCard.question}
                </p>
                
                <div className="mt-6 text-sm text-slate-500 opacity-75">
                  Click to reveal answer
                </div>
              </div>

              {/* Back of card (Answer) */}
              <div className="absolute w-full min-h-[320px] backface-hidden bg-gradient-to-br from-white via-emerald-50 to-teal-50 rounded-3xl shadow-2xl border border-white/50 p-8 flex flex-col items-center justify-center text-center rotate-y-180 backdrop-blur-sm">
                <div className="absolute top-4 left-4 w-3 h-3 bg-emerald-400 rounded-full opacity-60" />
                <div className="absolute top-4 left-10 w-2 h-2 bg-teal-400 rounded-full opacity-40" />
                <div className="absolute bottom-4 right-4 w-4 h-4 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full opacity-30" />
                
                <div className="mb-4 text-emerald-500 opacity-60">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                
                <p className="text-xl font-semibold text-slate-800 leading-relaxed max-w-md">
                  {currentCard.answer}
                </p>
                
                <div className="mt-6 text-sm text-slate-500 opacity-75">
                  Click to see question
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center space-x-6">
        <button
          onClick={handlePrevious}
          disabled={cards.length <= 1}
          className="group relative p-4 bg-white rounded-2xl shadow-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:shadow-xl hover:-translate-y-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg transition-all duration-300"
        >
          <ChevronLeft className="w-6 h-6" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </button>

        <button
          onClick={handleReset}
          className="group relative p-3 bg-gradient-to-r from-slate-100 to-slate-200 rounded-xl shadow-md text-slate-600 hover:from-slate-200 hover:to-slate-300 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300"
        >
          <RotateCcw className="w-5 h-5" />
        </button>

        <div className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl shadow-lg">
          <span className="text-white font-bold text-lg">
            {currentIndex + 1} / {cards.length}
          </span>
        </div>

        <button
          onClick={handleNext}
          disabled={cards.length <= 1}
          className="group relative p-4 bg-white rounded-2xl shadow-lg border border-slate-200 text-slate-600 hover:text-blue-600 hover:shadow-xl hover:-translate-y-1 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6" />
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        </button>
      </div>

      {/* Keyboard Hints */}
      <div className="mt-8 text-center">
        <p className="text-xs text-slate-400">
          Use arrow keys or click to navigate • Space to flip card
        </p>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
    </div>
  );
};

export default FlashcardDisplay;