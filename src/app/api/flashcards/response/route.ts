import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/lib/mongodb';
import { UserProgress } from '@/models/UserProgress';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { flashcardId, isCorrect } = body;

    if (!flashcardId || typeof isCorrect !== 'boolean') {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    await connectDB();

    const userProgress = await UserProgress.findOne({ userId });

    if (userProgress) {
      // User progress document exists, find and update the specific card response
      const cardResponseIndex = userProgress.responses.findIndex(
        (res: any) => res.flashcardId.toString() === flashcardId
      );

      if (cardResponseIndex > -1) {
        // Card response exists, update it
        userProgress.responses[cardResponseIndex].isCorrect = isCorrect;
        userProgress.responses[cardResponseIndex].updatedAt = new Date();
      } else {
        // Card response does not exist, add it to the array
        userProgress.responses.push({ flashcardId, isCorrect, updatedAt: new Date() });
      }
      await userProgress.save();
      return NextResponse.json(userProgress, { status: 200 });

    } else {
      // No progress document for this user, create a new one
      const newUserProgress = await UserProgress.create({
        userId,
        responses: [{ flashcardId, isCorrect, updatedAt: new Date() }],
      });
      return NextResponse.json(newUserProgress, { status: 201 });
    }
  } catch (error) {
    console.error('Error saving response:', error);
    return NextResponse.json({ error: 'Failed to save response' }, { status: 500 });
  }
} 