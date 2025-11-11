import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Moon, Sparkles, Send, Mic, MicOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { admobService } from "@/services/admob";
import { supabase } from "@/integrations/supabase/client";

export const DreamInterpretation = () => {
  const [dream, setDream] = useState("");
  const [interpretation, setInterpretation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [interpretationCount, setInterpretationCount] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const { toast } = useToast();
  const recognitionRef = useRef<any>(null);

  // Initialize AdMob and Speech Recognition on component mount
  useEffect(() => {
    admobService.initialize();
    admobService.showBanner();
    
    // Initialize Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'ar-SA'; // Arabic language
      
      recognitionRef.current.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }
        
        if (finalTranscript) {
          setDream(prev => prev + finalTranscript);
        }
      };
      
      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        
        let errorMessage = 'حدث خطأ في التسجيل الصوتي';
        if (event.error === 'not-allowed') {
          errorMessage = 'يرجى السماح بالوصول إلى الميكروفون';
        } else if (event.error === 'no-speech') {
          errorMessage = 'لم يتم اكتشاف أي كلام. حاول مرة أخرى';
        }
        
        toast({
          title: "خطأ",
          description: errorMessage,
          variant: "destructive",
        });
      };
      
      recognitionRef.current.onend = () => {
        if (isRecording) {
          recognitionRef.current?.start();
        }
      };
    }
    
    return () => {
      admobService.hideBanner();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [isRecording]);

  const toggleRecording = () => {
    if (!recognitionRef.current) {
      toast({
        title: "غير مدعوم",
        description: "التسجيل الصوتي غير مدعوم في هذا المتصفح",
        variant: "destructive",
      });
      return;
    }
    
    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
      toast({
        title: "تم إيقاف التسجيل",
        description: "يمكنك الآن تعديل النص أو إرساله",
      });
    } else {
      try {
        recognitionRef.current.start();
        setIsRecording(true);
        toast({
          title: "بدأ التسجيل",
          description: "تحدث الآن لتسجيل حلمك",
        });
      } catch (error) {
        console.error('Error starting recognition:', error);
        toast({
          title: "خطأ",
          description: "فشل في بدء التسجيل",
          variant: "destructive",
        });
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Stop recording if active
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    }
    
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
      
      // Save dream to database if user is logged in
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { error: saveError } = await supabase.from("dreams").insert({
          user_id: user.id,
          dream_text: dream.trim(),
          interpretation: data.interpretation,
        });

        if (saveError) {
          console.error("Error saving dream:", saveError);
        }
      }
      
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
        description: user ? "تم حفظ الحلم في سجلك" : "تم الحصول على تفسير حلمك",
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
              <label htmlFor="dream" className="flex items-center justify-between text-lg font-bold text-foreground">
                <span className="flex items-center gap-2">
                  <Moon className="w-5 h-5 text-secondary" />
                  اكتب حلمك هنا
                </span>
                <Button
                  type="button"
                  variant={isRecording ? "destructive" : "outline"}
                  size="sm"
                  onClick={toggleRecording}
                  disabled={isLoading}
                  className={`gap-2 ${isRecording ? 'animate-pulse' : ''}`}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-4 h-4" />
                      إيقاف التسجيل
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4" />
                      تسجيل صوتي
                    </>
                  )}
                </Button>
              </label>
              <Textarea
                id="dream"
                value={dream}
                onChange={(e) => setDream(e.target.value)}
                placeholder={isRecording ? "جارٍ التسجيل... تحدث الآن..." : "صف حلمك بالتفصيل... أو اضغط على زر التسجيل الصوتي"}
                className={`min-h-[200px] text-lg resize-none border-2 ${isRecording ? 'border-destructive/50 bg-destructive/5' : 'border-primary/20'} focus:border-secondary transition-colors`}
                disabled={isLoading}
                dir="rtl"
              />
              {isRecording && (
                <div className="flex items-center gap-2 text-sm text-destructive animate-pulse">
                  <div className="w-2 h-2 rounded-full bg-destructive"></div>
                  <span>جارٍ التسجيل...</span>
                </div>
              )}
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
