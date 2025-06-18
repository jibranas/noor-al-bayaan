import { NextResponse, NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import { FlashCard } from '@/models/FlashCard';
import type { CreateFlashCardInput } from '@/types/flashcard';
import mongoose from 'mongoose';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const ids = searchParams.get('ids');

    if (ids) {
      const objectIds = ids.split(',').map(id => {
        if (mongoose.Types.ObjectId.isValid(id)) {
          return new mongoose.Types.ObjectId(id);
        }
        return null;
      }).filter(id => id !== null);
      
      const flashcards = await FlashCard.find({
        '_id': { $in: objectIds }
      });
      return NextResponse.json(flashcards);
    } else {
      const flashcards = await FlashCard.find({}).sort({ createdAt: -1 });
      return NextResponse.json(flashcards);
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch flash cards' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body: CreateFlashCardInput = await request.json();
    
    await connectDB();
    const flashcard = await FlashCard.create(body);
    
    return NextResponse.json(flashcard, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create flash card' }, { status: 500 });
  }
} 