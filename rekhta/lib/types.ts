// 1. For Search Results (Simple Structure)
// Used in: WordList.tsx, SearchBar.tsx
export interface Word {
  id: string;
  word: string;
  meaning: string | null;
  lang?: number;
}

// 2. For Home Page & Details (Complex Structure)
// Used in: Dashboard.tsx, DetailModal.tsx

// The individual word item inside a section
export interface WordItem {
  I: string;       // ID
  W1?: string;     // English/Roman Word (e.g., "marja'")
  W2?: string;     // Hindi Word
  W3?: string;     // Urdu Word
  WM?: string;     // Meaning (e.g., "asylum")
  WO?: string;     // Origin
  RW?: { W: string }[]; // Broken down words (for proverbs)
}

// A Section (e.g., "Word of the Day", "Trending Words")
export interface HomeSection {
  HT: string;      // Header Title (e.g., "Word of the Day")
  R: WordItem[];   // List of items in this section
}

// The Root Response
export interface HomeResponse {
  R: {
    R: HomeSection[]; // Array of sections
  };
}