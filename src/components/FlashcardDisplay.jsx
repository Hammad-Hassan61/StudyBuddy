import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const FlashcardDisplay = ({ cards }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (!cards || cards.length === 0) {
    return <p className="text-gray-600">No flashcards generated yet.</p>;
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

  return (
    <div className="flex flex-col items-center space-y-6">
      <div 
        className="bg-white rounded-xl shadow-lg border border-blue-200 p-8 w-full max-w-lg min-h-[200px] flex items-center justify-center text-center cursor-pointer transition-all duration-300 transform perspective-1000 hover:shadow-xl"
        onClick={() => setShowAnswer(!showAnswer)}
        style={{ transform: showAnswer ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
      >
        <div 
          className="absolute backface-hidden"
          style={{ transform: showAnswer ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
        >
          {showAnswer ? (
            <p className="text-lg font-medium text-gray-800 break-words">{currentCard.answer}</p>
          ) : (
            <p className="text-xl font-semibold text-blue-700 break-words">{currentCard.question}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button
          onClick={handlePrevious}
          disabled={cards.length <= 1}
          className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <span className="text-gray-700 font-medium">
          {currentIndex + 1} / {cards.length}
        </span>
        <button
          onClick={handleNext}
          disabled={cards.length <= 1}
          className="p-3 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
};

export default FlashcardDisplay; 