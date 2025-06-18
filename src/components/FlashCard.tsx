'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import type { FlashCard as FlashCardType } from '@/types/flashcard';
import { FaVolumeUp, FaCheck, FaTimes } from 'react-icons/fa';
import { useAuth, SignedIn, SignedOut, SignInButton } from '@clerk/nextjs';

interface FlashCardProps {
  card: FlashCardType;
  onNextCard: () => void;
  isLastCard: boolean;
}

export default function FlashCard({ card, onNextCard, isLastCard }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const { userId } = useAuth();

  const imageName = encodeURIComponent(card.englishText);
  const imageUrl = `https://qaleelo-assets.s3.us-east-2.amazonaws.com/noor-al-bayaan/vocab-images/${imageName}.png`;
  const audioUrl = `https://qaleelo-assets.s3.us-east-2.amazonaws.com/noor-al-bayaan/vocab-sounds/${imageName}.mp3`;

  const playAudio = useCallback(() => {
    const audio = new Audio(audioUrl);
    audio.play().catch(error => console.error('Error playing audio:', error));
  }, [audioUrl]);

  // Play audio when card is flipped to back
  useEffect(() => {
    if (isFlipped) {
      playAudio();
    }
  }, [isFlipped, playAudio]);

  const handleAudioPlay = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card from flipping when clicking audio button
    playAudio();
  };

  const handleResponse = async (isCorrect: boolean) => {
    if (!userId || !card._id || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await fetch('/api/flashcards/response', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          flashcardId: card._id,
          isCorrect,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save response');
      }

      setFeedback(isCorrect ? 'Great job!' : 'Keep practicing!');
    } catch (error) {
      console.error('Error saving response:', error);
      setFeedback('Failed to save your response.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNextCard = () => {
    onNextCard();
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative w-full aspect-[3/4] cursor-pointer card-container"
        onClick={() => !feedback && setIsFlipped(!isFlipped)}
      >
        <div
          className={`relative w-full h-full transition-all duration-500 [transform-style:preserve-3d] ${
            isFlipped ? '[transform:rotateY(180deg)]' : ''
          }`}
        >
          {/* Front of card - Image */}
          <div className="absolute w-full h-full [backface-visibility:hidden]">
            <div className="bg-white rounded-xl shadow-lg p-6 h-full">
              <div className="relative w-full h-full">
                <Image
                  src={imageUrl}
                  alt={card.englishText}
                  fill
                  className="object-contain rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Back of card - Arabic text */}
          <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <div className="bg-white rounded-xl shadow-lg p-6 h-full flex flex-col items-center justify-center gap-4">
              <p className="text-6xl font-arabic">{card.arabicText}</p>
              <p className="text-4xl text-gray-800">{card.englishText}</p>
              
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={handleAudioPlay}
                  className="p-4 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                  aria-label="Play pronunciation"
                >
                  <FaVolumeUp className="w-6 h-6" />
                </button>

                <SignedIn>
                  {!feedback && (
                    <div className="flex flex-col gap-3 w-full min-w-[200px]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResponse(true);
                        }}
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-green-500 hover:bg-green-600 text-white transition-colors disabled:opacity-50"
                        aria-label="I got it right"
                      >
                        <FaCheck className="w-5 h-5" />
                        <span>I got it right</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleResponse(false);
                        }}
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-50"
                        aria-label="I got it wrong"
                      >
                        <FaTimes className="w-5 h-5" />
                        <span>I got it wrong</span>
                      </button>
                    </div>
                  )}
                </SignedIn>
                <SignedOut>
                  <div className="text-center p-4 mt-2 bg-gray-50 rounded-lg w-full max-w-[250px]">
                    <p className="font-semibold text-gray-800">
                      Track your progress
                    </p>
                    <SignInButton mode="modal">
                      <button className="mt-1 text-blue-600 hover:underline font-medium text-sm">
                        Sign In to save your results
                      </button>
                    </SignInButton>
                  </div>
                </SignedOut>
              </div>
            </div>
          </div>
        </div>
      </div>
      {feedback && (
        <div className="text-center">
          <p
            className={`text-xl font-semibold ${
              feedback.includes('Great') ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {feedback}
          </p>
          <button
            onClick={handleNextCard}
            className="mt-4 px-8 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors shadow-md"
          >
            {isLastCard ? 'Finish' : 'Next Card'}
          </button>
        </div>
      )}
      <SignedOut>
        {isFlipped && (
          <div className="text-center">
            <button
              onClick={handleNextCard}
              className="mt-4 px-8 py-3 rounded-lg bg-blue-500 hover:bg-blue-600 text-white font-semibold transition-colors shadow-md"
              aria-label={isLastCard ? 'Finish' : 'Next Card'}
            >
              <span>{isLastCard ? 'Finish' : 'Next Card'}</span>
            </button>
          </div>
        )}
      </SignedOut>
    </div>
  );
} 