export interface Question {
  id: number;
  emoji: string;
  question: string;
  description: string;
  category: 'sleep' | 'water' | 'walking' | 'exercise' | 'smoking' | 'alcohol' | 'stress' | 'vegetables' | 'fruits' | 'sugar' | 'fastfood' | 'weight' | 'energy' | 'screentime' | 'mental';
  positive: boolean; // true = answering 'yes' is healthy
}

export type Answer = 'yes' | 'no' | 'skip';

export interface Result {
  score: number; // 0-100
  healthAge: number;
  lifestyleRating: 'Excellent' | 'Good' | 'Average' | 'Poor';
  strengths: string[];
  riskAreas: string[];
  tips: string[];
}