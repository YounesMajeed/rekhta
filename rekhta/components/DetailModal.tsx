import { useCallback, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { X, Volume2, BookOpen, Quote } from 'lucide-react';
import { api } from '@/lib/api';
import { DetailedWordResponse } from '@/lib/types';
import Skeleton from './Skeleton';

interface DetailModalProps {
  id: string;
  onClose: () => void;
}

interface Definition {
  C: string;
}

// Helper function to highlight reference word in text
function highlightWord(text: string, referenceWord: string | null | undefined) {
  if (!referenceWord || !text) return text;

  const cleanRef = referenceWord.trim().replace(/[\s-]/g, '');
  if (!cleanRef) return text;

  const regex = new RegExp(`(${cleanRef.split('').join('\\s*')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, i) => {
    if (part && part.toLowerCase().replace(/\s/g, '') === cleanRef.toLowerCase()) {
      return (
        <span key={i} className="bg-amber-300/50 font-bold px-1 rounded">
          {part}
        </span>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function DetailModal({ id, onClose }: DetailModalProps) {
  const {
    data,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['word-detail', id],
    queryFn: () => api.getDetails(id),
    enabled: !!id,
  });

  const handlePlayAudio = useCallback(() => {
    if (data?.R?.BI?.AMF) {
      new Audio(data.R.BI.AMF).play();
    }
  }, [data?.R?.BI?.AMF]);

  // Organize meanings by language index
  const organizedMeanings = useMemo(() => {
    if (!data?.R?.ML) return { english: null, urdu: null, hindi: null };
    
    return {
      english: data.R.ML[0] || null,
      urdu: data.R.ML[2] || null,
      hindi: data.R.ML[1] || null,
    };
  }, [data?.R?.ML]);

  // Collect all synonyms from all meanings
  const allSynonyms = useMemo(() => {
    const synonyms = new Set<string>();
    data?.R?.ML?.forEach((meaning) => {
      meaning.R?.[0]?.MGL?.[0]?.WM?.forEach((def) => {
        def.RW?.forEach((word) => {
          if (word.W.trim()) synonyms.add(word.W.trim());
        });
      });
    });
    return Array.from(synonyms);
  }, [data?.R?.ML]);

  // Collect all idioms
  const allIdioms = useMemo(() => {
    const idioms: any[] = [];
    data?.R?.ML?.forEach((meaning) => {
      meaning.R?.[0]?.IL?.R?.forEach((idiom) => {
        idioms.push(idiom);
      });
    });
    return idioms;
  }, [data?.R?.ML]);

  // Collect all shers
  const allShers = useMemo(() => {
    const shers: any[] = [];
    let sherListData: any = null;
    data?.R?.ML?.forEach((meaning) => {
      if (meaning.R?.[0]?.SL?.R) {
        shers.push(...meaning.R[0].SL.R);
        sherListData = meaning.R[0].SL;
      }
    });
    return { shers, sherListData };
  }, [data?.R?.ML]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] shadow-2xl h-[85vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 z-10 hover:bg-slate-200 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="h-full overflow-y-auto p-6 pb-20">
          {isLoading ? (
            <div className="space-y-6 mt-10">
              <Skeleton className="h-32 rounded-3xl" />
              <Skeleton className="h-48 rounded-3xl" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-20 rounded-2xl" />
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mt-10">
              Failed to load word details. Please try again.
            </div>
          ) : data?.R?.BI ? (
            <div className="space-y-6 mt-2">
              {/* 1. Basic Info Section */}
              <div className="text-center pb-6 border-b border-slate-200">
                <span className="inline-block px-3 py-1 bg-violet-50 text-violet-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-4">
                  Origin: {data.R.BI.WO || 'Unknown'}
                </span>

                <div className="flex flex-col items-center gap-2">
                  <h2 className="text-6xl text-slate-900 leading-tight font-urdu" dir="rtl">
                    {data.R.BI.W3}
                  </h2>
                  <h3 className="text-3xl font-serif text-slate-700 font-hindi">
                    {data.R.BI.W2}
                  </h3>

                  <div className="flex items-center gap-3">
                    <span className="text-xl italic text-slate-400 font-medium font-english">
                      {data.R.BI.W1}
                    </span>
                    {data.R.BI.HA && data.R.BI.AMF && (
                      <button
                        onClick={handlePlayAudio}
                        className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 hover:bg-violet-600 transition-all"
                        aria-label="Play pronunciation"
                      >
                        <Volume2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* 2. English Meaning */}
              {organizedMeanings.english && (
                <MeaningSection 
                  meaning={organizedMeanings.english}
                  title="English Meaning"
                  colorClass="bg-slate-50 border-slate-100"
                  isRtl={false}
                  fontClass="[font-family:var(--font-geist)]"
                />
              )}

              {/* 3. Urdu Meaning */}
              {organizedMeanings.urdu && (
                <MeaningSection 
                  meaning={organizedMeanings.urdu}
                  title="Urdu Tashreeh"
                  colorClass="bg-emerald-50 border-emerald-100"
                  isRtl={true}
                  fontClass="[font-family:var(--font-noto-urdu)] nastaliq"
                />
              )}

              {/* 4. Hindi Meaning */}
              {organizedMeanings.hindi && (
                <MeaningSection 
                  meaning={organizedMeanings.hindi}
                  title="Hindi Arth"
                  colorClass="bg-orange-50 border-orange-100"
                  isRtl={false}
                  fontClass="[font-family:var(--font-noto-hindi)]"
                />
              )}

              {/* 5. Synonyms Section */}
              {allSynonyms.length > 0 && (
                <div className="p-5 rounded-3xl border border-blue-100 bg-blue-50">
                  <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-3 block">
                    Synonyms
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {allSynonyms.map((word, i) => (
                      <span
                        key={i}
                        className="inline-block px-3 py-1 bg-white/60 rounded-full text-sm text-slate-700 border border-blue-200/50"
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Idioms Section */}
              {allIdioms.length > 0 && (
                <div className="p-5 rounded-3xl border border-purple-100 bg-purple-50">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen size={14} className="text-purple-600" />
                    <label className="text-[10px] font-bold text-purple-600 uppercase tracking-widest">
                      Idioms
                    </label>
                  </div>
                  <div className="space-y-3">
                    {allIdioms.map((idiom, i) => (
                      <div key={i} className="text-sm text-slate-800 p-3 bg-white/50 rounded-lg">
                        <p className="font-medium mb-1">
                          {idiom.RW?.map((w: any) => w.W).join(' ').trim()}
                        </p>
                        {idiom.PN && <p className="text-[12px] text-slate-500">— {idiom.PN}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 7. Sher/Poetry Examples Section */}
              {allShers.shers.length > 0 && (
                <div className="p-5 rounded-3xl border border-amber-100 bg-amber-50">
                  <div className="flex items-center gap-2 mb-3">
                    <Quote size={14} className="text-amber-600" />
                    <label className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
                      {allShers.sherListData?.HT || 'Poetry Examples'}
                    </label>
                  </div>
                  <div className="space-y-4">
                    {allShers.shers.map((sher, i) => (
                      <div key={i} className="text-sm text-slate-800 p-4 bg-white/60 rounded-lg border-l-2 border-amber-300">
                        <p className="text-amber-900 font-serif italic leading-relaxed mb-2">
                          {highlightWord(
                            sher.RW?.map((w: any) => w.W).join(' ').trim() || '',
                            allShers.sherListData?.SW
                          )}
                        </p>
                        {sher.PN && (
                          <p className="text-[12px] text-slate-600 font-medium">
                            — {sher.PN}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 8. Related/Random Words */}
              {data.R.R && data.R.R.length > 0 && (
                <div className="p-5 rounded-3xl border border-pink-100 bg-pink-50">
                  <label className="text-[10px] font-bold text-pink-600 uppercase tracking-widest mb-3 block">
                    Related Words
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {data.R.R.slice(0, 10).map((word: any, i: number) => (
                      <span
                        key={i}
                        className="inline-block px-3 py-1 bg-white/60 rounded-full text-sm text-slate-700 border border-pink-200/50"
                      >
                        {typeof word === 'string' ? word : word.W || 'Word'}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <p className="text-center text-slate-400 mt-20">Details unavailable.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// Helper component for meaning sections
function MeaningSection({ 
  meaning, 
  title, 
  colorClass,
  isRtl,
  fontClass = ''
}: {
  meaning: any;
  title: string;
  colorClass: string;
  isRtl: boolean;
  fontClass?: string;
}) {
  const definitions = meaning.R?.[0]?.MGL?.[0]?.WM || [];
  const type = meaning.R?.[0]?.MGL?.[0]?.MT || '';

  if (definitions.length === 0) return null;

  return (
    <div className={`p-5 rounded-3xl border ${colorClass}`}>
      <div className="flex justify-between items-center mb-3">
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
          {title}
        </label>
        {type && (
          <span className="text-[10px] bg-white/50 px-2 py-1 rounded text-slate-500 font-medium">
            {type}
          </span>
        )}
      </div>
      <ul
        className={`space-y-3 ${fontClass} ${isRtl ? 'text-right text-2xl' : 'text-lg font-medium'}`}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {definitions.map((def: Definition, i: number) => (
          <li key={i} className="text-slate-800 leading-relaxed">
            {def.C}
          </li>
        ))}
      </ul>
    </div>
  );
}