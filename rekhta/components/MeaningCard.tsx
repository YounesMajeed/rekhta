interface MeaningCardProps {
  section: any;
  index: number;
}

export default function MeaningCard({ section, index }: MeaningCardProps) {
  const definitions = section.R?.[0]?.MGL?.[0]?.WM || [];
  const type = section.R?.[0]?.MGL?.[0]?.MT || '';

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
        className={`space-y-3 ${isRtl ? 'text-right nastaliq' : ''}`}
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {definitions.map((def: any, i: number) => (
          <li
            key={i}
            className={`text-slate-800 leading-relaxed ${
              isRtl ? 'text-2xl' : 'text-lg font-medium'
            }`}
          >
            {def.C}
          </li>
        ))}
      </ul>
    </div>
  );
}