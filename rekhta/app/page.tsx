'use client';

import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { useSearchStore } from '@/lib/store';
import { HomeResponse, Word } from '@/lib/types';
import SearchBar from '@/components/SearchBar';
import Dashboard from '@/components/Dashboard';
import WordList from '@/components/WordList';
import DetailModal from '@/components/DetailModal';
import { DashboardSkeleton, WordListSkeleton } from '@/components/Skeleton';

export default function Lughat() {
  // State
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { addSearch } = useSearchStore();

  // Fetch home data
  const {
    data: homeData,
    isLoading: isHomeLoading,
    error: homeError,
  } = useQuery({
    queryKey: ['home'],
    queryFn: api.getHome,
  });

  // Fetch search results (only when query has at least 2 characters)
  const {
    data: results = [],
    isLoading: isSearchLoading,
    error: searchError,
  } = useQuery({
    queryKey: ['search', query],
    queryFn: () => api.search(query),
    enabled: query.length >= 2,
  });

  // Handlers
  const handleSearch = useCallback((newQuery: string) => {
    setQuery(newQuery);
    if (newQuery.length >= 2) {
      addSearch(newQuery);
    }
  }, [addSearch]);

  const handleOpenModal = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedId(null);
  }, []);

  const isSearchActive = query.length > 0;

  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      <SearchBar query={query} setQuery={handleSearch} />

      <div className="max-w-md mx-auto p-4 space-y-6">
        {isSearchActive ? (
          // Search Results Section
          <>
            {searchError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                Failed to search. Please try again.
              </div>
            )}
            {isSearchLoading ? (
              <WordListSkeleton />
            ) : results.length > 0 ? (
              <WordList results={results} onOpen={handleOpenModal} />
            ) : (
              <div className="text-center py-12">
                <p className="text-slate-400 text-sm">No results found for "{query}"</p>
              </div>
            )}
          </>
        ) : (
          // Home Section
          <>
            {homeError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                Failed to load home data. Please try again.
              </div>
            )}
            {isHomeLoading ? (
              <DashboardSkeleton />
            ) : homeData ? (
              <>
                <Dashboard data={homeData} onOpen={handleOpenModal} />
                <footer className="pt-10 pb-6 text-center animate-in fade-in slide-in-from-bottom-2 duration-700">
                  <div className="w-12 h-0.5 bg-slate-200 mx-auto mb-4 rounded-full"></div>
                  <p className="text-xs text-slate-400 font-medium tracking-wide">
                    A hobby project by <span className="text-slate-600 font-semibold">Younis Majeed</span>
                  </p>
                </footer>
              </>
            ) : null}
          </>
        )}
      </div>

      {selectedId && (
        <DetailModal id={selectedId} onClose={handleCloseModal} />
      )}
    </main>
  );
}