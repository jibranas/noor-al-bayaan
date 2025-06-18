'use client';

import FlashCardGrid from '@/components/FlashCardGrid';
import { Suspense } from 'react';

function PracticePageContent() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center py-8">Practice Wrong Cards</h1>
        <FlashCardGrid />
      </div>
    </main>
  );
}

export default function PracticePage() {
  return (
    <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
      <PracticePageContent />
    </Suspense>
  );
} 