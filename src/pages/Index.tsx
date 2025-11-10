import { Hero } from "@/components/Hero";
import { DreamInterpretation } from "@/components/DreamInterpretation";

const Index = () => {
  return (
    <div className="min-h-screen islamic-pattern">
      <Hero />
      
      <main className="container mx-auto px-4 py-16 md:py-24">
        <DreamInterpretation />
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
