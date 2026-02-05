import { MeaningsList } from '@/lib/types';
import { BookOpen, Quote } from 'lucide-react';

interface MeaningCardProps {
  section: MeaningsList;
  index: number;
}

// Helper function to highlight reference word in text
function highlightWord(text: string, referenceWord: string | null | undefined) {
  if (!referenceWord || !text) return text;

  // Clean up the reference word (remove extra spaces, special characters)
  const cleanRef = referenceWord.trim().replace(/[\s-]/g, '');
  
  if (!cleanRef) return text;

  // Create a regex that matches the word with flexible spacing
  const regex = new RegExp(`(${cleanRef.split('').join('\\s*')})`, 'gi');
  const parts = text.split(regex);
  
  return parts.map((part, i) => {
    // Check if this part matches our reference word (accounting for spaces)
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

export default function MeaningCard({ section, index }: MeaningCardProps) {
  const definitions = section.R?.[0]?.MGL?.[0]?.WM || [];
  const type = section.R?.[0]?.MGL?.[0]?.MT || '';
  const idiomList = section.R?.[0]?.IL;
  const sherList = section.R?.[0]?.SL;

  if (definitions.length === 0) return null;

  let title = 'Definition';
  let colorClass = 'bg-slate-50 border-slate-100';
  let isRtl = false;

  if (index === 0) {
    title = 'English Definition';
  } else if (index === 1) {
    title = 'Hindi Arth';
    colorClass = 'bg-orange-50 border-orange-100';
  } else if (index === 2) {
    title = 'Urdu Tashreeh';
    colorClass = 'bg-emerald-50 border-emerald-100';
    isRtl = true;
  }

  return (
    <div className="space-y-4">
      {/* Meanings */}
      <div className={`p-5 rounded-3xl border ${colorClass} mb-4`}>
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
          className={`space-y-3 ${isRtl ? 'text-right nastaliq text-2xl' : 'text-lg font-medium'}`}
          dir={isRtl ? 'rtl' : 'ltr'}
        >
          {definitions.map((def, i) => (
            <li key={i} className="text-slate-800 leading-relaxed">
              {def.C}
            </li>
          ))}
        </ul>

        {/* Synonyms/Related Words */}
        {definitions[0]?.RW && definitions[0].RW.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200/50">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">
              Synonyms
            </p>
            <div className="flex flex-wrap gap-2">
              {definitions[0].RW.map((word, i) => (
                <span
                  key={i}
                  className="inline-block px-3 py-1 bg-white/60 rounded-full text-sm text-slate-700 border border-slate-200/50"
                >
                  {word.W.trim()}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Idioms Section */}
      {idiomList && idiomList.R && idiomList.R.length > 0 && (
        <div className="p-5 rounded-3xl border border-blue-100 bg-blue-50">
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={14} className="text-blue-600" />
            <label className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">
              Idioms
            </label>
          </div>
          <div className="space-y-3">
            {idiomList.R.map((idiom, i) => (
              <div key={i} className="text-sm text-slate-800 p-3 bg-white/50 rounded-lg">
                <p className="font-medium mb-1">
                  {idiom.RW?.map((w) => w.W).join(' ').trim()}
                </p>
                {idiom.PN && <p className="text-[12px] text-slate-500">— {idiom.PN}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Sher/Proverbs Section */}
      {sherList && sherList.R && sherList.R.length > 0 && (
        <div className="p-5 rounded-3xl border border-amber-100 bg-amber-50">
          <div className="flex items-center gap-2 mb-3">
            <Quote size={14} className="text-amber-600" />
            <label className="text-[10px] font-bold text-amber-600 uppercase tracking-widest">
              {sherList.HT || 'Poetry Examples'}
            </label>
          </div>
          <div className="space-y-4">
            {sherList.R.map((sher, i) => (
              <div key={i} className="text-sm text-slate-800 p-4 bg-white/60 rounded-lg border-l-2 border-amber-300">
                <p className="text-amber-900 font-serif italic leading-relaxed mb-2">
                  {highlightWord(
                    sher.RW?.map((w) => w.W).join(' ').trim() || '',
                    sherList.SW
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
    </div>
  );
}