import { useEffect, useState } from 'react';
import { X, Volume2 } from 'lucide-react';
import { api } from '@/lib/api';
import MeaningCard from './MeaningCard';

interface DetailModalProps {
  id: string;
  onClose: () => void;
}

export default function DetailModal({ id, onClose }: DetailModalProps) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getDetails(id)
      .then(setData)
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-white rounded-t-[2.5rem] shadow-2xl h-[85vh] overflow-hidden animate-in slide-in-from-bottom duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-slate-100 rounded-full text-slate-500 z-10"
        >
          <X size={20} />
        </button>

        <div className="h-full overflow-y-auto p-6 pb-20">
          {loading ? (
            <div className="space-y-6 mt-10 animate-pulse">
              <div className="h-32 bg-slate-100 rounded-3xl" />
              <div className="h-48 bg-slate-100 rounded-3xl" />
            </div>
          ) : data && data.R?.BI ? (
            <div className="space-y-8 mt-2">
              {/* Hero Section */}
              <div className="text-center">
                <span className="inline-block px-3 py-1 bg-violet-50 text-violet-600 text-[10px] font-bold uppercase tracking-widest rounded-full mb-6">
                  Origin: {data.R.BI.WO || 'Unknown'}
                </span>

                <div className="flex flex-col items-center gap-1">
                  <h2 className="text-6xl text-slate-900 leading-tight nastaliq" dir="rtl">
                    {data.R.BI.W3}
                  </h2>
                  <h3 className="text-3xl font-serif text-slate-700 mt-2">
                    {data.R.BI.W2}
                  </h3>

                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-xl italic text-slate-400 font-medium">
                      {data.R.BI.W1}
                    </span>
                    {data.R.BI.AMF && (
                      <button
                        onClick={() => new Audio(data.R.BI.AMF).play()}
                        className="w-10 h-10 bg-slate-900 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 hover:bg-violet-600 transition-all"
                      >
                        <Volume2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Meanings */}
              <div>
                {data.R.ML?.map((section: any, index: number) => (
                  <MeaningCard key={index} section={section} index={index} />
                ))}
              </div>
            </div>
          ) : (
            <p className="text-center text-slate-400 mt-20">Details unavailable.</p>
          )}
        </div>
      </div>
    </div>
  );
}