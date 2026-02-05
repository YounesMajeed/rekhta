import { Search, X } from 'lucide-react';

interface SearchBarProps {
  query: string;
  setQuery: (q: string) => void;
}

export default function SearchBar({ query, setQuery }: SearchBarProps) {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3">
      <div className="max-w-md mx-auto">
        <h1 className="text-xl font-bold mb-3 tracking-tight font-english">
          Lughat<span className="text-violet-600">.</span>
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search words..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-slate-100 border-none rounded-xl py-3 pl-10 pr-10 focus:ring-2 focus:ring-violet-500 outline-none transition-all font-english"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}