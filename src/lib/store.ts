// Simple in-memory store. Resets on server restart.
export interface Doc {
  id: string;
  name: string;
  content: string;
  chunks: string[];
}

export interface HistoryItem {
  id: string;
  question: string;
  answer: string;
  source: string;
  timestamp: Date;
}

export const documents: Doc[] = [];
export const history: HistoryItem[] = [];