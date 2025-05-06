/**
 * Interface for vocabulary items used throughout the application
 */
export interface VocabItem {
  word: string;
  translation: string;
  known?: boolean;
}

/**
 * Interface for progress tracking
 */
export interface ProgressInfo {
  current: number;
  total: number;
  percentage: number;
}