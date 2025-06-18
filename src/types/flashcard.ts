export interface FlashCard {
  _id?: string;
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