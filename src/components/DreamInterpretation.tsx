import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Moon, Sparkles, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { admobService } from "@/services/admob";

export const DreamInterpretation = () => {
  const [dream, setDream] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [interpretationCount, setInterpretationCount] = useState(0);
  const { toast } = useToast();

  // Initialize AdMob on component mount
  useEffect(() => {
    admobService.initialize();
    admobService.showBanner();
    
    return () => {
      admobService.hideBanner();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!dream.trim()) {
      toast({
        title: "الرجاء إدخال حلمك",
        description: "يجب عليك وصف حلمك لنتمكن من تفسيره",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setInterpretation("");

    try {
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/interpret-dream`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
          },
          body: JSON.stringify({ dream: dream.trim() }),
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'فشل في الحصول على التفسير');
      }

      const data = await response.json();
      setInterpretation(data.interpretation);
      
      // Show interstitial ad every 3 interpretations
      setInterpretationCount(prev => {
        const newCount = prev + 1;
        if (newCount % 3 === 0) {
          admobService.showInterstitial();
        }
        return newCount;
      });
      
      toast({
        title: "تم التفسير بنجاح",
        description: "تم الحصول على تفسير حلمك",
      });
    } catch (error) {
      console.error('Error interpreting dream:', error);
      toast({
        title: "حدث خطأ",
        description: error instanceof Error ? error.message : "فشل في الحصول على التفسير. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8">
      {/* Dream Input Form */}
      <Card className="border-2 border-primary/20 shadow-xl backdrop-blur-sm bg-card/95">
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label htmlFor="dream" className="flex items-center gap-2 text-lg font-bold text-foreground">
                <Moon className="w-5 h-5 text-secondary" />
                اكتب حلمك هنا
              </label>
              <Textarea
                id="dream"
                value={dream}
                onChange={(e) => setDream(e.target.value)}
                placeholder="صف حلمك بالتفصيل... كلما كان الوصف أدق، كان التفسير أوضح"
                className="min-h-[200px] text-lg resize-none border-2 border-primary/20 focus:border-secondary transition-colors"
                disabled={isLoading}
                dir="rtl"
              />
            </div>
            
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full py-6 text-lg font-bold bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 transition-all shadow-lg glow-gold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="ml-2 h-5 w-5 animate-spin" />
                  جارٍ التفسير...
                </>
              ) : (
                <>
                  <Sparkles className="ml-2 h-5 w-5" />
                  فسّر حلمي
                  <Send className="mr-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Interpretation Display */}
      {interpretation && (
        <Card className="border-2 border-accent/30 shadow-2xl backdrop-blur-sm bg-card/95 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/10">
                  <Sparkles className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-gradient">التفسير</h3>
              </div>
              
              <div className="p-6 rounded-lg bg-muted/50 border border-accent/20">
                <p className="text-lg leading-relaxed text-foreground whitespace-pre-wrap" dir="rtl">
                  {interpretation}
                </p>
              </div>
              
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground text-center" dir="rtl">
                  ملاحظة: هذا التفسير يعتمد على الذكاء الاصطناعي وهو للإرشاد فقط. 
                  يُنصح بالرجوع إلى أهل العلم للتفسيرات الدقيقة.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
