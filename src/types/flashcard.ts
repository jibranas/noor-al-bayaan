import { Types } from 'mongoose';

/* eslint-disable no-var */

declare global {
  var mongoose: {
    promise: ReturnType<typeof import('mongoose')['connect']> | null;
    conn: Awaited<ReturnType<typeof import('mongoose')['connect']>> | null;
  };
}

export interface FlashCard {
  _id?: Types.ObjectId;
  imageUrl: string;
  arabicText: string;
  englishText: string;
  category: string;
  audioUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateFlashCardInput {
  imageUrl: string;
  arabicText: string;
  englishText: string;
  category: string;
  audioUrl?: string;
} 