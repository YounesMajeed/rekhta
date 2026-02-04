'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { HomeResponse, WordItem } from '@/lib/types';
import SearchBar from '@/components/SearchBar';
import Dashboard from '@/components/Dashboard';
import WordList from '@/components/WordList';
import DetailModal from '@/components/DetailModal';

export default function Lughat() {
  const [query, setQuery] = useState('');
  const [homeData, setHomeData] = useState<HomeResponse | null>(null);
  const [results, setResults] = useState<WordItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // 1. Fetch Home Data
  useEffect(() => {
    api.getHome()
      .then(setHomeData)
      .catch((err) => console.error('Home Error:', err));
  }, []);

  // 2. Search Handler
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      api.search(query).then(setResults);
    }, 400);
    return () => clearTimeout(timer);
  }, [query]);

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      <SearchBar query={query} setQuery={setQuery} />

      <div className="max-w-md mx-auto p-4 space-y-6">
        {query.length > 0 ? (
          <WordList results={results} onOpen={setSelectedId} />
        ) : (
          <Dashboard data={homeData} onOpen={setSelectedId} />
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