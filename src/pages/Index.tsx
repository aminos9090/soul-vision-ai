import { useState, useEffect } from "react";
import { Hero } from "@/components/Hero";
import { DreamInterpretation } from "@/components/DreamInterpretation";
import { DreamHistory } from "@/components/DreamHistory";
import { Navbar } from "@/components/Navbar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Brain, History } from "lucide-react";

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setIsLoggedIn(!!session);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      
      <main className="container mx-auto px-4 py-12 -mt-20 relative z-10">
        {isLoggedIn ? (
          <Tabs defaultValue="interpret" className="w-full max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="interpret" className="gap-2">
                <Brain className="w-4 h-4" />
                تفسير جديد
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <History className="w-4 h-4" />
                سجل الأحلام
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="interpret">
              <DreamInterpretation />
            </TabsContent>
            
            <TabsContent value="history">
              <DreamHistory />
            </TabsContent>
          </Tabs>
        ) : (
          <DreamInterpretation />
        )}
      </main>
      
      <footer className="border-t border-border/50 mt-20 py-8 bg-card/30 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground" dir="rtl">
            تفسير الأحلام AI - تطبيق إسلامي متطور لتفسير الأحلام بالذكاء الاصطناعي
          </p>
          <p className="text-sm text-muted-foreground mt-2" dir="rtl">
            جميع الحقوق محفوظة © 2024
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
