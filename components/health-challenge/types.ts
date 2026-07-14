export interface Question {
  id: number;
  emoji: string;
  question: string;
  description: string;
  category: string;
  positive: boolean;
}

export type Answer = 'yes' | 'no' | 'skip';

export interface Result {
  score: number;
  healthAge: number;
  lifestyleRating: 'Excellent' | 'Good' | 'Average' | 'Poor';
  strengths: string[];
  riskAreas: string[];
  tips: string[];
}