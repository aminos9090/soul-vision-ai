import { Moon, Star, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-bg.jpg";

export const Hero = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={heroImage} 
          alt="Islamic night sky" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 gradient-bg opacity-90" />
      </div>
      
      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-20 md:py-32">
        <div className="text-center space-y-8 max-w-4xl mx-auto">
          {/* Decorative Elements */}
          <div className="flex justify-center items-center gap-4 animate-float">
            <Star className="w-8 h-8 text-secondary fill-secondary" />
            <Moon className="w-12 h-12 text-secondary fill-secondary" />
            <Star className="w-8 h-8 text-secondary fill-secondary" />
          </div>
          
          {/* Main Heading */}
          <h1 className="text-5xl md:text-7xl font-black text-primary-foreground leading-tight" dir="rtl">
            تفسير الأحلام AI
          </h1>
          
          {/* Subtitle with Gradient */}
          <p className="text-2xl md:text-3xl font-bold text-gradient" dir="rtl">
            اكتشف معاني أحلامك بالذكاء الاصطناعي
          </p>
          
          {/* Description */}
          <p className="text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed" dir="rtl">
            تطبيق إسلامي متطور يستخدم أحدث تقنيات الذكاء الاصطناعي لتقديم تفسير دقيق وموثوق لأحلامك
            بناءً على التفاسير الإسلامية المعتمدة
          </p>
          
          {/* Features */}
          <div className="flex flex-wrap justify-center gap-6 pt-6">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-secondary/30">
              <Sparkles className="w-5 h-5 text-secondary" />
              <span className="text-primary-foreground font-semibold">تفسير فوري</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-accent/30">
              <Moon className="w-5 h-5 text-accent" />
              <span className="text-primary-foreground font-semibold">موثوق إسلامياً</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 backdrop-blur-sm border border-secondary/30">
              <Sparkles className="w-5 h-5 text-secondary" />
              <span className="text-primary-foreground font-semibold">ذكاء اصطناعي متقدم</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Wave Decoration */}
      <div className="absolute bottom-0 left-0 right-0 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 120" className="w-full h-auto">
          <path 
            fill="hsl(var(--background))" 
            d="M0,64L48,69.3C96,75,192,85,288,80C384,75,480,53,576,48C672,43,768,53,864,58.7C960,64,1056,64,1152,58.7C1248,53,1344,43,1392,37.3L1440,32L1440,120L1392,120C1344,120,1248,120,1152,120C1056,120,960,120,864,120C768,120,672,120,576,120C480,120,384,120,288,120C192,120,96,120,48,120L0,120Z"
          />
        </svg>
      </div>
    </div>
  );
};
