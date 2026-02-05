import { Sparkles, BookOpen, Feather } from 'lucide-react';
import { HomeResponse } from '@/lib/types';

interface DashboardProps {
  data: HomeResponse | null;
  onOpen: (id: string) => void;
}

export default function Dashboard({ data, onOpen }: DashboardProps) {
  if (!data?.R?.R) return null;

  // 1. Find Specific Sections by their Header Title (HT)
  const sections = data.R.R;
  
  const wodSection = sections.find(s => s.HT === "Word of the Day");
  const proverbSection = sections.find(s => s.HT === "Today's Proverb");
  // Using "Trending Words" as your "Random Words" list
  const listSection = sections.find(s => s.HT === "Trending Words");

  // Helper to extract data safely
  const wod = wodSection?.R?.[0];
  const proverb = proverbSection?.R?.[0];
  const trendingList = listSection?.R || [];

  return (
    <div className="space-y-6 animate-in fade-in">
      
      {/* --- WORD OF THE DAY --- */}
      {wod && (
        <div
          onClick={() => onOpen(wod.I)}
          className="bg-violet-600 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden cursor-pointer active:scale-95 transition-transform"
        >
          <div className="relative z-10">
            <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-1 rounded">
                Word of the Day
                </span>
                <span className="text-[10px] text-violet-200 uppercase tracking-widest">{wod.WO}</span>
            </div>
            
            <div className="mt-4">
                <h2 className="text-4xl font-serif mb-1 font-urdu leading-loose" dir="rtl">{wod.W3}</h2>
                <h3 className="text-xl opacity-90 font-medium font-english">{wod.W1}</h3>
            </div>
            
            <p className="opacity-80 text-sm mt-2 line-clamp-2 border-t border-white/20 pt-2">
                {wod.WM}
            </p>
          </div>
          {/* Decorative Circle */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        </div>
      )}

      {/* --- PROVERB --- */}
      {proverb && (
        <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
            <div className="flex items-center gap-2 mb-3">
                <Feather size={16} className="text-emerald-400" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Proverb</span>
            </div>
            
            {/* Proverb Construction: Join the RW array if W3 is missing */}
            <h2 className="text-2xl font-serif mb-2 font-urdu leading-relaxed text-right" dir="rtl">
                {proverb.RW ? proverb.RW.map(w => w.W).join(' ') : proverb.W3}
            </h2>
            
            <p className="text-slate-400 text-sm italic border-l-2 border-emerald-500 pl-3 mt-2">
                "{proverb.WM}"
            </p>
        </div>
      )}

      {/* --- RANDOM / TRENDING LIST --- */}
      {trendingList.length > 0 && (
        <div>
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2 px-1">
            <Sparkles size={16} className="text-amber-500" /> Trending & Random
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {trendingList.map((item) => (
              <div
                key={item.I}
                onClick={() => onOpen(item.I)}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm active:scale-95 transition-transform cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-2">
                    <h4 className="font-serif text-xl text-slate-800 font-urdu group-hover:text-violet-600 transition-colors" dir="rtl">
                        {item.W3}
                    </h4>
                </div>
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 font-english">{item.W1}</p>
                <p className="text-xs text-slate-400 line-clamp-1 font-english">{item.WM}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}