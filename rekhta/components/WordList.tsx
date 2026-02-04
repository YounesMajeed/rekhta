import { ChevronRight } from 'lucide-react';
import { Word } from '@/lib/types'; // <--- Make sure this imports 'Word'

interface WordListProps {
  results: Word[];
  onOpen: (id: string) => void;
}

export default function WordList({ results, onOpen }: WordListProps) {
  return (
    <div className="space-y-3 animate-in fade-in">
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        Found {results.length} results
      </p>
      {results.map((item) => (
        <div
          key={item.id}
          onClick={() => onOpen(item.id)}
          className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm active:scale-95 transition-transform cursor-pointer flex justify-between items-center"
        >
          <div>
            <h3 className="text-xl font-serif font-medium text-slate-800">
              {item.word}
            </h3>
            <p className="text-sm text-slate-500 line-clamp-1">
              {item.meaning || 'Tap to view details'}
            </p>
          </div>
          <ChevronRight size={16} className="text-slate-300" />
        </div>
      ))}
    </div>
  );
}