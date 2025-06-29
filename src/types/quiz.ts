export interface Question {
  id: number;
  question: string;
  options: string[];
  correct: number;
  explanation?: string;
}

export interface QuizState {
  questions: Question[];
  allQuestions: Question[]; // Store all loaded questions
  currentQuestionIndex: number;
  selectedAnswers: (number | null)[];
  score: number;
  isCompleted: boolean;
  isLoading: boolean;
  error: string | null;
  isConfiguring: boolean; // New state for quiz configuration
  mode: 'study' | 'exam'; // Quiz mode
  timeLimit: number | null; // Time limit in minutes, null for unlimited
  timeRemaining: number | null; // Time remaining in seconds
  isTimerActive: boolean; // Whether timer is currently running
}

export interface QuizResults {
  score: number;
  totalQuestions: number;
  percentage: number;
  correctAnswers: number;
  incorrectAnswers: number;
}

export interface QuizConfig {
  questionCount: number | 'all';
  randomize: boolean;
  mode: 'study' | 'exam';
  timeLimit: number | null; // Time limit in minutes, null for unlimited
}