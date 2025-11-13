import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { BookOpen, Sparkles, Moon, Star, Heart, Brain, Eye } from "lucide-react";

export default function FAQ() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookOpen className="w-10 h-10 text-primary animate-pulse" />
              <h1 className="text-4xl md:text-5xl font-bold text-gradient" dir="rtl">
                الأسئلة الشائعة
              </h1>
              <Sparkles className="w-10 h-10 text-accent animate-pulse" />
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto" dir="rtl">
              كل ما تحتاج معرفته عن تفسير الأحلام في الإسلام
            </p>
          </div>

          {/* Educational Articles */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gradient" dir="rtl">
                  <Moon className="w-6 h-6 text-primary" />
                  أهمية تفسير الأحلام في الإسلام
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3" dir="rtl">
                <p className="text-foreground/90 leading-relaxed">
                  الرؤيا الصالحة جزء من ستة وأربعين جزءاً من النبوة، كما أخبرنا النبي محمد ﷺ. 
                  وهي بشرى من الله للمؤمن، وقد يرى المسلم في منامه ما يدل على خير أو يحذره من شر.
                </p>
                <p className="text-foreground/90 leading-relaxed">
                  لذلك كان من المهم معرفة تفسير الأحلام بما يتوافق مع الشريعة الإسلامية وأقوال العلماء.
                </p>
              </CardContent>
            </Card>

            <Card className="border-2 border-accent/20 hover:border-accent/40 transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gradient" dir="rtl">
                  <Star className="w-6 h-6 text-accent" />
                  أنواع الأحلام في الإسلام
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3" dir="rtl">
                <div className="space-y-2">
                  <p className="font-semibold text-primary">1. الرؤيا الصالحة:</p>
                  <p className="text-foreground/90">من الله، وهي بشرى للمؤمن</p>
                  
                  <p className="font-semibold text-accent mt-3">2. حديث النفس:</p>
                  <p className="text-foreground/90">ما يفكر فيه الإنسان في يقظته</p>
                  
                  <p className="font-semibold text-destructive mt-3">3. أضغاث الأحلام:</p>
                  <p className="text-foreground/90">من الشيطان ليحزن المؤمن</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gradient" dir="rtl">
                  <Heart className="w-6 h-6 text-secondary" />
                  آداب رؤية الأحلام
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2" dir="rtl">
                <ul className="list-disc list-inside space-y-2 text-foreground/90">
                  <li>إذا رأيت رؤيا حسنة فاحمد الله واحكها لمن تحب</li>
                  <li>إذا رأيت رؤيا سيئة فتعوذ بالله ولا تحكها لأحد</li>
                  <li>انفث عن يسارك ثلاثاً إذا رأيت ما تكره</li>
                  <li>تحول عن جنبك الذي كنت عليه</li>
                  <li>صل ركعتين واستعن بالله</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary/20 hover:border-primary/40 transition-all duration-300 hover:shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gradient" dir="rtl">
                  <Brain className="w-6 h-6 text-primary" />
                  علماء تفسير الأحلام
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2" dir="rtl">
                <ul className="list-disc list-inside space-y-2 text-foreground/90">
                  <li><strong>ابن سيرين:</strong> من أشهر المفسرين في التاريخ الإسلامي</li>
                  <li><strong>النابلسي:</strong> صاحب كتاب "تعطير الأنام في تفسير الأحلام"</li>
                  <li><strong>ابن شاهين:</strong> له مؤلفات عديدة في تفسير الرؤى</li>
                  <li><strong>الإمام الصادق:</strong> من علماء تفسير الأحلام المعروفين</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* FAQ Section */}
          <Card className="border-2 border-primary/30 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl text-gradient" dir="rtl">
                <Eye className="w-7 h-7 text-primary" />
                الأسئلة الأكثر شيوعاً
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full space-y-2">
                <AccordionItem value="item-1" className="border border-border/50 rounded-lg px-4">
                  <AccordionTrigger className="text-right hover:no-underline" dir="rtl">
                    <span className="font-semibold">هل جميع الأحلام لها تفسير؟</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/90 leading-relaxed" dir="rtl">
                    ليس كل حلم له تفسير. هناك ثلاثة أنواع من الأحلام: الرؤيا الصالحة من الله وهي التي تفسر، 
                    وحديث النفس وهو ما يفكر فيه الإنسان في يقظته، وأضغاث الأحلام من الشيطان وليس لها تفسير حقيقي.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2" className="border border-border/50 rounded-lg px-4">
                  <AccordionTrigger className="text-right hover:no-underline" dir="rtl">
                    <span className="font-semibold">متى يجب أن أقص حلمي على أحد؟</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/90 leading-relaxed" dir="rtl">
                    إذا رأيت رؤيا صالحة فيُستحب أن تقصها على من تحب وتثق به. أما الرؤيا السيئة فلا تقصها على أحد،
                    بل استعذ بالله من الشيطان وانفث عن يسارك ثلاثاً، وتحول عن جنبك، ولا تحدث بها أحداً.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3" className="border border-border/50 rounded-lg px-4">
                  <AccordionTrigger className="text-right hover:no-underline" dir="rtl">
                    <span className="font-semibold">هل يمكن أن تتحقق الأحلام؟</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/90 leading-relaxed" dir="rtl">
                    الرؤيا الصالحة من الله قد تتحقق، وهي بشرى للمؤمن. قال النبي ﷺ: "الرؤيا الصالحة من الله". 
                    لكن يجب الحذر من التفسيرات الخاطئة، ولا يجوز البناء على الأحلام في اتخاذ قرارات مصيرية دون استشارة أهل العلم.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-4" className="border border-border/50 rounded-lg px-4">
                  <AccordionTrigger className="text-right hover:no-underline" dir="rtl">
                    <span className="font-semibold">ما حكم تفسير الأحلام بالذكاء الاصطناعي؟</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/90 leading-relaxed" dir="rtl">
                    الذكاء الاصطناعي أداة مساعدة تعتمد على كتب التفسير الإسلامية المعتمدة. يمكن استخدامه 
                    كمرجع أولي للإرشاد، لكن يُنصح دائماً بالرجوع إلى العلماء وأهل الاختصاص في تفسير الأحلام 
                    للحصول على تفسير دقيق، خاصة في الأمور المهمة.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-5" className="border border-border/50 rounded-lg px-4">
                  <AccordionTrigger className="text-right hover:no-underline" dir="rtl">
                    <span className="font-semibold">هل للألوان في الأحلام معاني خاصة؟</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/90 leading-relaxed" dir="rtl">
                    نعم، للألوان دلالات في تفسير الأحلام. فمثلاً: اللون الأخضر يدل على الخير والبركة، 
                    الأبيض يدل على الصفاء والنقاء، الأسود قد يدل على الهم أو الغم، والذهبي يدل على المال والرزق. 
                    لكن التفسير يعتمد على سياق الحلم بالكامل.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-6" className="border border-border/50 rounded-lg px-4">
                  <AccordionTrigger className="text-right hover:no-underline" dir="rtl">
                    <span className="font-semibold">ماذا أفعل إذا رأيت حلماً مزعجاً؟</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/90 leading-relaxed" dir="rtl">
                    إذا رأيت حلماً مزعجاً، فاتبع هذه الخطوات: استعذ بالله من الشيطان ثلاث مرات، 
                    انفث عن يسارك ثلاثاً، تحول عن الجنب الذي كنت نائماً عليه، صل ركعتين إن أمكن، 
                    ولا تخبر به أحداً. واعلم أن الحلم السيئ من الشيطان ولن يضرك بإذن الله.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-7" className="border border-border/50 rounded-lg px-4">
                  <AccordionTrigger className="text-right hover:no-underline" dir="rtl">
                    <span className="font-semibold">هل يجوز تفسير أحلام الآخرين؟</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/90 leading-relaxed" dir="rtl">
                    يجوز تفسير أحلام الآخرين إذا كان لديك علم بتفسير الأحلام من مصادر موثوقة. 
                    لكن يجب الحذر من التفسير بلا علم، لأن الرؤيا تقع على ما تُفسر به. 
                    قال النبي ﷺ: "الرؤيا على رجل طائر ما لم تُعبَّر، فإذا عُبِّرت وقعت". 
                    لذا يجب التفسير بالخير دائماً.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-8" className="border border-border/50 rounded-lg px-4">
                  <AccordionTrigger className="text-right hover:no-underline" dir="rtl">
                    <span className="font-semibold">لماذا لا أتذكر أحلامي؟</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-foreground/90 leading-relaxed" dir="rtl">
                    عدم تذكر الأحلام أمر طبيعي ويحدث لكثير من الناس. قد يكون بسبب النوم العميق، 
                    أو التعب الشديد، أو الإجهاد. لتحسين تذكر الأحلام: نم بشكل منتظم، احرص على النوم 
                    على طهارة، اقرأ أذكار النوم، وحاول الاستيقاظ ببطء مع محاولة تذكر ما رأيته فوراً.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          {/* Important Note */}
          <Card className="border-2 border-accent/30 bg-accent/5">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground italic leading-relaxed" dir="rtl">
                <strong className="text-foreground">تنبيه مهم:</strong> المعلومات الواردة في هذا القسم هي للإرشاد العام فقط. 
                للحصول على تفسير دقيق وموثوق لأحلامك، يُنصح بالرجوع إلى العلماء المختصين في تفسير الرؤى 
                والأحلام وفق الشريعة الإسلامية.
              </p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}