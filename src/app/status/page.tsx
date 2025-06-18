'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Confetti from 'react-confetti';

interface Status {
  total: number;
  correct: number;
  incorrect: number;
  wrongFlashcardIds: string[];
  totalFlashcards: number;
}

export default function StatusPage() {
  const [status, setStatus] = useState<Status | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const router = useRouter();

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/status');
        if (!response.ok) {
          throw new Error('Failed to fetch status');
        }
        const data = await response.json();
        setStatus(data);

        if (data.totalFlashcards > 0 && data.correct === data.totalFlashcards) {
          setShowConfetti(true);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    fetchStatus();
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePracticeWrong = () => {
    if (status && status.wrongFlashcardIds.length > 0) {
      const ids = status.wrongFlashcardIds.join(',');
      router.push(`/flashcards/practice?ids=${ids}`);
    }
  };

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (error) return <div className="text-center py-10 text-red-500">{error}</div>;
  if (!status) return <div className="text-center py-10 text-gray-500">No progress found.</div>;

  const progressPercentage = status.totalFlashcards > 0 ? (status.total / status.totalFlashcards) * 100 : 0;

  return (
    <>
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={300}
        />
      )}
      <div className="container mx-auto px-4 py-10">
        <h1 className="text-4xl font-bold text-center mb-8">Your Progress</h1>
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-medium text-gray-700">Progress</span>
              <span className="text-lg font-bold text-blue-600">{progressPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4">
              <div
                className="bg-blue-500 h-4 rounded-full"
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-right text-sm text-gray-600 mt-1">
              {status.total} / {status.totalFlashcards} cards completed
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-green-100 p-4 rounded-lg">
              <p className="text-3xl font-bold text-green-600">{status.correct}</p>
              <p className="text-gray-600">Correct</p>
            </div>
            <div className="bg-red-100 p-4 rounded-lg">
              <p className="text-3xl font-bold text-red-600">{status.incorrect}</p>
              <p className="text-gray-600">Incorrect</p>
            </div>
          </div>
          {status.incorrect > 0 && (
            <div className="mt-8 text-center">
              <button
                onClick={handlePracticeWrong}
                className="px-8 py-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white font-semibold transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={status.wrongFlashcardIds.length === 0}
              >
                Practice {status.incorrect} Wrong Card{status.incorrect > 1 ? 's' : ''}
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
} 