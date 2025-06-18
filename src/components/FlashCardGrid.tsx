'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import FlashCard from './FlashCard';
import type { FlashCard as FlashCardType } from '@/types/flashcard';

export default function FlashCardGrid() {
  const [flashcards, setFlashcards] = useState<FlashCardType[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const ids = searchParams.get('ids');
  const router = useRouter();

  useEffect(() => {
    fetchFlashcards();
  }, [ids]);

  const fetchFlashcards = async () => {
    try {
      const url = ids ? `/api/flashcards?ids=${ids}` : '/api/flashcards';
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch flash cards');
      
      const data = await response.json() as FlashCardType[];
      setFlashcards(data);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const nextCard = () => {
    if (currentIndex === flashcards.length - 1) {
      router.push('/status');
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (flashcards.length === 0) return <div className="text-center py-10 text-gray-500">No flash cards found.</div>;

  const isLastCard = currentIndex === flashcards.length - 1;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      <div className="w-full text-center mb-8">
        <span className="text-gray-600 font-medium">
          Card {currentIndex + 1} of {flashcards.length}
        </span>
      </div>

      {/* Current Card */}
      <div className="w-full max-w-xl mx-auto">
        <FlashCard
          key={flashcards[currentIndex]?._id?.toString()}
          card={flashcards[currentIndex]}
          onNextCard={nextCard}
          isLastCard={isLastCard}
        />
      </div>
    </div>
  );
} 