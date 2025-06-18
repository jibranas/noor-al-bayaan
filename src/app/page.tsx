import FlashCardGrid from '@/components/FlashCardGrid';

export default function HomePage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Flash Cards */}
      <div className="container mx-auto px-4">
        <FlashCardGrid />
      </div>
    </main>
  );
}
