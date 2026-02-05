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

// ============================================================
// DETAILED WORD RESPONSE TYPES (from API detail endpoint)
// ============================================================

// Related word with optional synonym reference
export interface RelatedWord {
  W: string;       // Word text
  SW?: {           // Synonym (optional)
    I: string;     // ID
    W: string;     // Word
    WC: string;    // Word class/category
  } | null;
}

// Word meaning details
export interface WordMeaning {
  C: string;       // Content/meaning
  RW: RelatedWord[]; // Related words/synonyms
  ME?: string | null;
  MN?: string | null;
}

// Meaning group with linguistic information
export interface MeaningGroup {
  MT: string;      // Meaning type (e.g., "Persian, Arabic - Noun, Feminine")
  RF: boolean;     // Referenced flag
  WM: WordMeaning[]; // Word meanings array
}

// Sher/Poetry example
export interface SherExample {
  I: string;       // ID
  WM: string | null;
  RF: boolean;
  PN: string;      // Poet name
  PD: string | null; // Poet details
  RW: RelatedWord[]; // Related words
  BG: string | null; // Background
}

// Sher/Poetry examples list
export interface SherList {
  R: SherExample[];
  HT: string;      // Header title (e.g., "Sher Examples")
  DE: string;      // Description
  IC: boolean;     // Is collapsed
  RF: boolean;     // Referenced flag
  SW: string | null;
  TT: number;      // Type/Tense
  TBC: string | null;
}

// Idiom item
export interface IdiomItem {
  I: string;
  WM: string | null;
  RF: boolean;
  PN: string;      // Related person/poet name
  PD: string | null;
  RW: RelatedWord[];
  BG: string | null;
}

// Idiom list
export interface IdiomList {
  R: IdiomItem[];
  HT: string;
  DE: string;
  IC: boolean;
  RF: boolean;
  SW: string | null;
  TT: number;
  TBC: string | null;
}

// Variant item
export interface VariantItem {
  I: string;
  W: string;
  // Additional fields as needed
}

// Single meaning entry with grammar details
export interface MeaningEntry {
  MGL: MeaningGroup[];
  IL: IdiomList | null;  // Idioms list
  VL: VariantItem[] | null; // Variants list
  SL: SherList | null;   // Sher/Poetry examples and proverbs
}

// Main meanings list entry
export interface MeaningsList {
  R: MeaningEntry[];
  HT: string;      // Header title (e.g., "English meaning of...")
  DE: string | null;
  IC: boolean;     // Is collapsed
  RF: boolean;     // Referenced flag
  SW: string | null; // Script word
  TT: number;      // Type/Tense
  TBC: string | null;
}

// Basic word information
export interface BasicWordInfo {
  HA: boolean;     // Has audio
  AMF: string | null;
  AOF: string | null;
  ST: string;      // Share text
  WU: string;      // Word URL
  I: string;       // ID
  W1: string;      // English/Roman word
  W2: string;      // Hindi word
  W3: string;      // Urdu word
  WM: string | null;
  WO: string;      // Word origin
  RF: boolean;     // Referenced flag
  ME: string | null;
  MH: string | null;
  MU: string | null;
  ScriptId: number;
}

// Additional info item
export interface AdditionalInfoItem {
  CT: string;      // Category type (e.g., "vazn")
  ST: string;      // Section title
  ITT: boolean;    // Is tooltip text
  TTT: string;     // Tooltip text
  RF: boolean;
  WC: string;
  R: Array<{
    WI: string;
    WV: string;
  }>;
  TT: number;
  TBC: string | null;
}

// Complete detailed word response
export interface DetailedWordResponse {
  S: number;       // Status
  Me: string | null;
  Mh: string | null;
  Mu: string | null;
  R: {
    ML: MeaningsList[];
    BI: BasicWordInfo;
    AIL: AdditionalInfoItem[];
    R: any[];
    ScriptId: number;
  };
  T: string;       // Timestamp
}