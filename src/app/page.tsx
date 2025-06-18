import FlashCardGrid from '@/components/FlashCardGrid';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Suspense fallback={<div className="text-center py-10">Loading...</div>}>
        <FlashCardGrid />
      </Suspense>
    </div>
  );
}
