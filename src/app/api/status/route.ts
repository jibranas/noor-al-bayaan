import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import { UserProgress } from '@/models/UserProgress';
import { FlashCard } from '@/models/FlashCard';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    const totalFlashcards = await FlashCard.countDocuments({});
    const userProgress = await UserProgress.findOne({ userId });

    if (!userProgress) {
      return NextResponse.json({
        total: 0,
        correct: 0,
        incorrect: 0,
        wrongFlashcardIds: [],
        totalFlashcards,
      });
    }

    const correct = userProgress.responses.filter((r: any) => r.isCorrect).length;
    const incorrect = userProgress.responses.filter((r: any) => !r.isCorrect).length;
    const total = correct + incorrect;

    const wrongFlashcardIds = userProgress.responses
      .filter((r: any) => !r.isCorrect)
      .map((r: any) => r.flashcardId);
      
    return NextResponse.json({
      total,
      correct,
      incorrect,
      wrongFlashcardIds,
      totalFlashcards,
    });
  } catch (error) {
    console.error('Failed to get status:', error);
    return NextResponse.json({ error: 'Failed to get status' }, { status: 500 });
  }
} 