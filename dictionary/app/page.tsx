'use client';

import { useState, useEffect } from 'react';
import { Search, X, Volume2, Sparkles, ChevronRight, BookOpen } from 'lucide-react';

// --- TYPES ---
interface Word {
  id: string;
  word: string;
  meaning: string;
  lang: number;
}

interface HomeData {
  WOD: Word; // Word of the Day
  POD: Word; // Proverb of the Day
  RW: Word[]; // Random Words
}

export default function LughatOnePage() {
  // --- STATE ---
  const [query, setQuery] = useState('');
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [results, setResults] = useState<Word[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [detailData, setDetailData] = useState<any>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // --- 1. FETCH HOME DATA (On Load) ---
  useEffect(() => {
    fetch('/api/proxy?action=home')
      .then(res => res.json())
      .then(data => setHomeData(data))
      .catch(err => console.error("Home Error:", err));
  }, []);

  // --- 2. SEARCH HANDLER (Debounced) ---
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      fetch(`/api/proxy?action=search&q=${query}`)
        .then(res => res.json())
        .then(data => setResults(data.WordList || []));
    }, 400); // 400ms delay

    return () => clearTimeout(timer);
  }, [query]);

  // --- 3. DETAIL HANDLER ---
  const openDetail = async (id: string) => {
    setSelectedId(id);
    setLoadingDetail(true);
    setDetailData(null);
    try {
      const res = await fetch(`/api/proxy?action=detail&id=${id}`);
      const json = await res.json();
      // Rekhta returns details deeply nested: R -> R -> [0]
      const data = json.R?.R?.[0] || json; 
      setDetailData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetail(false);
    }
  };

  // --- RENDER ---
  return (
    <main className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-20">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 px-4 py-3">
        <div className="max-w-md mx-auto">
          <h1 className="text-xl font-bold mb-3 tracking-tight">
            Lughat<span className="text-violet-600">.</span>
          </h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search words..." 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-slate-100 border-none rounded-xl py-3 pl-10 pr-10 focus:ring-2 focus:ring-violet-500 outline-none transition-all"
            />
            {query && (
              <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* --- MAIN CONTENT AREA --- */}
      <div className="max-w-md mx-auto p-4 space-y-6">
        
        {/* VIEW A: SEARCH RESULTS */}
        {query.length > 0 ? (
          <div className="space-y-3 animate-in fade-in">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Found {results.length} results
            </p>
            {results.map((item) => (
              <div 
                key={item.id} 
                onClick={() => openDetail(item.id)}
                className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm active:scale-95 transition-transform cursor-pointer flex justify-between items-center"
              >
                <div>
                  <h3 className="text-xl font-serif font-medium">{item.word}</h3>
                  <p className="text-sm text-slate-500 line-clamp-1">{item.meaning || 'Tap to view meaning'}</p>
                </div>
                <ChevronRight size={16} className="text-slate-300" />
              </div>
            ))}
            {results.length === 0 && <p className="text-center text-slate-400 py-10">No matches found.</p>}
          </div>
        ) : (
          /* VIEW B: HOME DASHBOARD */
          <div className="space-y-6 animate-in fade-in">
            {/* 1. Word of Day */}
            {homeData?.WOD && (
              <div onClick={() => openDetail(homeData.WOD.id)} className="bg-violet-600 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden cursor-pointer active:scale-95 transition-transform">
                <div className="relative z-10">
                  <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 px-2 py-1 rounded">Word of the Day</span>
                  <h2 className="text-3xl font-serif mt-3 mb-1">{homeData.WOD.word}</h2>
                  <p className="opacity-90 text-sm">{homeData.WOD.meaning}</p>
                </div>
                <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-xl" />
              </div>
            )}

            {/* 2. Proverb of Day */}
            {homeData?.POD && (
              <div onClick={() => openDetail(homeData.POD.id)} className="bg-slate-900 text-white p-6 rounded-3xl shadow-lg cursor-pointer active:scale-95 transition-transform">
                 <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">Proverb</span>
                 <h2 className="text-2xl font-serif mt-2 mb-1">{homeData.POD.word}</h2>
                 <p className="opacity-80 text-sm italic">"{homeData.POD.meaning}"</p>
              </div>
            )}

            {/* 3. Random Words */}
            {homeData?.RW && (
              <div>
                <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-500"/> Random Picks
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {homeData.RW.map(w => (
                    <div key={w.id} onClick={() => openDetail(w.id)} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm active:scale-95 transition-transform cursor-pointer">
                      <h4 className="font-serif text-lg">{w.word}</h4>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!homeData && (
              <div className="space-y-4 animate-pulse">
                <div className="h-48 bg-slate-200 rounded-3xl"/>
                <div className="h-32 bg-slate-200 rounded-3xl"/>
              </div>
            )}
          </div>
        )}
      </div>

      {/* --- MODAL: DETAIL VIEW --- */}
      {selectedId && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setSelectedId(null)} />
          
          {/* Sheet */}
          <div className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] shadow-2xl h-[85vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
            <button onClick={() => setSelectedId(null)} className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 z-10">
              <X size={20} />
            </button>

            <div className="h-full overflow-y-auto p-6 pb-20">
              {loadingDetail ? (
                <div className="space-y-6 mt-10 animate-pulse">
                  <div className="h-8 bg-slate-200 w-1/3 mx-auto rounded"/>
                  <div className="h-24 bg-slate-100 rounded-3xl"/>
                  <div className="h-48 bg-slate-100 rounded-3xl"/>
                </div>
              ) : detailData ? (
                <div className="text-center space-y-8 mt-4">
                  
                  {/* Word Hero */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest bg-violet-50 text-violet-600 px-3 py-1 rounded-full">
                      Origin: {detailData.OE || 'Unknown'}
                    </span>
                    <h2 className="text-6xl mt-4 mb-1 text-slate-900 leading-tight nastaliq" dir="rtl">
                      {detailData.WU}
                    </h2>
                    <h3 className="text-2xl font-serif text-slate-600">{detailData.WH}</h3>
                    <div className="flex items-center justify-center gap-2 mt-2">
                       <span className="text-lg italic text-slate-400">{detailData.WE}</span>
                       {detailData.AMF && (
                         <button onClick={() => new Audio(detailData.AMF).play()} className="p-2 bg-slate-900 text-white rounded-full ml-2 active:scale-90 transition-transform">
                           <Volume2 size={16}/>
                         </button>
                       )}
                    </div>
                  </div>

                  {/* Meanings */}
                  <div className="space-y-4 text-left">
                    <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">English</label>
                      <p className="text-lg font-medium text-slate-800">{detailData.ME}</p>
                    </div>
                    
                    <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Urdu Tashreeh</label>
                      <p className="text-2xl text-slate-800 leading-loose text-right nastaliq" dir="rtl">{detailData.MU}</p>
                    </div>

                    <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                      <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2">Hindi</label>
                      <p className="text-lg text-slate-700">{detailData.MH}</p>
                    </div>
                  </div>

                </div>
              ) : (
                <p className="text-center text-slate-400 mt-20">Details unavailable.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}