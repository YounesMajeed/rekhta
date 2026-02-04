interface DailyCardProps {
  title: string;
  word: string;
  meaning: string;
  type?: 'word' | 'proverb';
}

export default function DailyCard({ title, word, meaning, type = 'word' }: DailyCardProps) {
  const isProverb = type === 'proverb';
  
  return (
    <div className={`relative overflow-hidden rounded-3xl p-6 ${isProverb ? 'bg-slate-900 text-white' : 'bg-violet-600 text-white'} shadow-xl`}>
      <div className="relative z-10">
        <span className="opacity-80 text-xs font-bold uppercase tracking-widest border border-white/20 px-2 py-1 rounded-md">
          {title}
        </span>
        <h3 className="text-3xl font-serif mt-4 mb-2">{word}</h3>
        <p className="opacity-90 text-sm leading-relaxed line-clamp-2">{meaning}</p>
      </div>
      
      {/* Decorative background element */}
      <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
    </div>
  );
}