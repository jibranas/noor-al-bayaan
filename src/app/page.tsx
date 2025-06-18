import FlashCardGrid from '@/components/FlashCardGrid';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Flash Cards */}
      <div className="container mx-auto px-4">
        <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
          <FlashCardGrid />
        </Suspense>
      </div>
    </main>
  );
}
