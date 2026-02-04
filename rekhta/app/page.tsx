'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { HomeResponse, Word } from '@/lib/types'; // <--- Import both types
import SearchBar from '@/components/SearchBar';
import Dashboard from '@/components/Dashboard';
import WordList from '@/components/WordList';
import DetailModal from '@/components/DetailModal';

export default function Lughat() {
  // 1. Search Query
  const [query, setQuery] = useState('');

  // 2. Home Data (Complex Structure)
  const [homeData, setHomeData] = useState<HomeResponse | null>(null);

  // 3. Search Results (Simple Structure -> Word[])
  // THIS WAS THE FIX: Ensure this is typed as Word[], not WordItem[]
  const [results, setResults] = useState<Word[]>([]); 

  // 4. Selected ID for Modal
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Fetch Home Data on Load
  useEffect(() => {
    api.getHome()
      .then(setHomeData)
      .catch((err) => console.error('Home Error:', err));
  }, []);

  // Handle Search (Debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      // api.search returns Promise<Word[]>, which matches setResults
      api.search(query).then(setResults);
    }, 400);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      <SearchBar query={query} setQuery={setQuery} />

      <div className="max-w-md mx-auto p-4 space-y-6">
        {query.length > 0 ? (
          /* WordList expects results to be Word[] */
          <WordList results={results} onOpen={setSelectedId} />
        ) : (
          /* Dashboard expects data to be HomeResponse */
          <>
          <Dashboard data={homeData} onOpen={setSelectedId} />

          /* Credit Section */
            <footer className="pt-10 pb-6 text-center animate-in fade-in slide-in-from-bottom-2 duration-700">
              <div className="w-12 h-0.5 bg-slate-200 mx-auto mb-4 rounded-full"></div>
              <p className="text-xs text-slate-400 font-medium tracking-wide">
                A hobby project by <span className="text-slate-600 font-semibold">Younis Majeed</span>
              </p>
            </footer>
            </>
        )}
      </div>

      {selectedId && (
        <DetailModal 
          id={selectedId} 
          onClose={() => setSelectedId(null)} 
        />
      )}
    </main>
  );
}