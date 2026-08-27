/**
 * Core data models for the EdTech Quiz application.
 * Defines the structure of questions, user responses and evaluation results.
 */

export interface Question {
  id: number;
  question: string;
  options: string[];
}

export interface QuizSubmission {
  answers: { [key: number]: number };
}

export interface QuestionResultDetail {
  correct: boolean;
  correct_answer: number;
}

export interface ResultResponse {
  score: number;
  total: number;
  results: { [key: number]: QuestionResultDetail };
}
