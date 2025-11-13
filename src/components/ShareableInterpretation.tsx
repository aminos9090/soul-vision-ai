import { Moon, Sparkles } from "lucide-react";

interface ShareableInterpretationProps {
  dreamText: string;
  interpretation: string;
}

export const ShareableInterpretation = ({ dreamText, interpretation }: ShareableInterpretationProps) => {
  return (
    <div 
      className="w-[600px] min-h-[800px] p-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-950 relative overflow-hidden"
      style={{ direction: 'rtl' }}
    >
      {/* Islamic Pattern Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-amber-400 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-emerald-400 to-transparent rounded-full blur-3xl"></div>
      </div>
      
      {/* Stars Pattern */}
      <div className="absolute inset-0 opacity-20">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-amber-300 rounded-full"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>
      
      {/* Content */}
      <div className="relative z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-3 pb-4 border-b-2 border-amber-400/30">
          <div className="flex items-center justify-center gap-3">
            <Moon className="w-8 h-8 text-amber-400" />
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-500">
              تفسير الأحلام AI
            </h1>
            <Sparkles className="w-8 h-8 text-amber-400" />
          </div>
          <p className="text-amber-200/80 text-sm">تفسير إسلامي بالذكاء الاصطناعي</p>
        </div>
        
        {/* Dream Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-gradient-to-r from-amber-400 to-transparent rounded-full"></div>
            <h2 className="text-xl font-bold text-amber-300">الحلم</h2>
          </div>
          <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-amber-400/20">
            <p className="text-white/90 text-base leading-relaxed line-clamp-6">
              {dreamText}
            </p>
          </div>
        </div>
        
        {/* Interpretation Section */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-1 bg-gradient-to-r from-emerald-400 to-transparent rounded-full"></div>
            <h2 className="text-xl font-bold text-emerald-300">التفسير</h2>
          </div>
          <div className="p-4 rounded-lg bg-white/10 backdrop-blur-sm border border-emerald-400/20">
            <p className="text-white/90 text-sm leading-relaxed">
              {interpretation.length > 400 ? interpretation.slice(0, 400) + '...' : interpretation}
            </p>
          </div>
        </div>
        
        {/* Footer */}
        <div className="pt-6 mt-6 border-t border-amber-400/20">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
              <p className="text-amber-200/60 text-xs">
                للإرشاد فقط - يُنصح بالرجوع إلى أهل العلم
              </p>
              <div className="w-2 h-2 rounded-full bg-amber-400"></div>
            </div>
            <p className="text-amber-400 font-bold text-sm">
              تطبيق تفسير الأحلام AI
            </p>
          </div>
        </div>
      </div>
      
      {/* Decorative Crescents */}
      <div className="absolute top-4 right-4 text-amber-400/20 text-6xl">☪</div>
      <div className="absolute bottom-4 left-4 text-amber-400/20 text-6xl">☪</div>
    </div>
  );
};