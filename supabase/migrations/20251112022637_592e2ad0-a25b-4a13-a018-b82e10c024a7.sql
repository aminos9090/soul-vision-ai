-- Create dream symbols table
CREATE TABLE public.dream_symbols (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  symbol_name TEXT NOT NULL,
  category TEXT NOT NULL,
  meanings JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on dream_symbols
ALTER TABLE public.dream_symbols ENABLE ROW LEVEL SECURITY;

-- Public read access for dream symbols
CREATE POLICY "Anyone can view dream symbols" 
ON public.dream_symbols 
FOR SELECT 
USING (true);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_dream_symbols_updated_at
BEFORE UPDATE ON public.dream_symbols
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create search index
CREATE INDEX idx_dream_symbols_name ON public.dream_symbols USING gin(to_tsvector('arabic', symbol_name));
CREATE INDEX idx_dream_symbols_category ON public.dream_symbols(category);

-- Insert initial Islamic dream symbols
INSERT INTO public.dream_symbols (symbol_name, category, meanings) VALUES
('الماء', 'عناصر الطبيعة', '{"positive": ["الحياة والبركة", "العلم والحكمة", "الرزق الحلال"], "negative": ["الفتن إن كان عكرا", "الهموم إن كان غزيرا"]}'),
('النار', 'عناصر الطبيعة', '{"positive": ["السلطة والقوة", "العلم النافع"], "negative": ["الفتنة والبلاء", "الظلم والجور"]}'),
('الطيور', 'الحيوانات', '{"positive": ["الأخبار السارة", "الرزق والخير", "الملائكة"], "negative": ["الهموم إن كانت سوداء"]}'),
('الثعبان', 'الحيوانات', '{"positive": ["الشفاء من المرض إن قتله", "النصر على الأعداء"], "negative": ["العدو الخفي", "الخيانة والغدر"]}'),
('القرآن', 'العبادات', '{"positive": ["العلم والهداية", "البركة والخير", "الشفاء من الأمراض"], "negative": []}'),
('الصلاة', 'العبادات', '{"positive": ["قضاء الحاجة", "الاستقامة", "البركة في الأمور"], "negative": ["نقصان في الدين إن كانت غير صحيحة"]}'),
('المسجد', 'أماكن', '{"positive": ["الأمن والأمان", "الهداية", "اجتماع الخير"], "negative": []}'),
('البيت', 'أماكن', '{"positive": ["الزوجة والأسرة", "الاستقرار", "البركة"], "negative": ["الخراب إن كان متهدما"]}'),
('الطريق', 'أماكن', '{"positive": ["سبيل الحق", "السفر المبارك"], "negative": ["الضلال إن كان مظلما"]}'),
('الذهب', 'أشياء مادية', '{"positive": ["الرزق والثراء", "الزينة"], "negative": ["الفتنة والبلاء في بعض الأحيان"]}'),
('الفضة', 'أشياء مادية', '{"positive": ["المرأة الصالحة", "الرزق الحلال"], "negative": []}'),
('اللؤلؤ', 'أشياء مادية', '{"positive": ["العلم والحكمة", "الذرية الصالحة", "القرآن"], "negative": []}'),
('الشمس', 'أجرام سماوية', '{"positive": ["السلطان والحاكم العادل", "الوالد", "الهداية"], "negative": ["غضب السلطان إن احترقت"]}'),
('القمر', 'أجرام سماوية', '{"positive": ["الوزير الصالح", "الوالدة", "العالم"], "negative": []}'),
('النجوم', 'أجرام سماوية', '{"positive": ["العلماء والصالحون", "الهداية"], "negative": ["الفتن إن سقطت"]}'),
('الطعام', 'طعام وشراب', '{"positive": ["الرزق والخير", "العلم"], "negative": ["المرض إن كان فاسدا"]}'),
('العسل', 'طعام وشراب', '{"positive": ["الرزق الحلال", "الشفاء", "القرآن"], "negative": []}'),
('اللبن', 'طعام وشراب', '{"positive": ["الفطرة", "الرزق", "العلم"], "negative": []}'),
('الثياب البيضاء', 'ملابس', '{"positive": ["الصلاح والتقوى", "البشرى", "النقاء"], "negative": []}'),
('الثياب الخضراء', 'ملابس', '{"positive": ["الجنة", "الدين", "الخير"], "negative": []}'),
('الطيران', 'أفعال', '{"positive": ["السفر المبارك", "تحقيق الأماني", "الرفعة"], "negative": ["السقوط يدل على الفتنة"]}'),
('السقوط', 'أفعال', '{"positive": [], "negative": ["فقدان المكانة", "الضلال", "المعصية"]}'),
('البكاء', 'أفعال', '{"positive": ["الفرج والسرور إن كان بلا صراخ", "التوبة"], "negative": ["الحزن إن كان بصراخ"]}'),
('الموت', 'أحداث', '{"positive": ["التوبة", "طول العمر", "الزواج للأعزب"], "negative": ["فساد الدين إن لم يدفن"]}'),
('الزواج', 'أحداث', '{"positive": ["الخير والبركة", "الشراكة الناجحة"], "negative": ["الهم إن كانت العروس غير معروفة"]}'),
('الجبل', 'عناصر الطبيعة', '{"positive": ["الرجل العظيم", "الثبات", "العلو"], "negative": ["العقبة الصعبة"]}'),
('البحر', 'عناصر الطبيعة', '{"positive": ["السلطان", "الرزق الواسع"], "negative": ["الفتن إن كان هائجا"]}'),
('الشجرة', 'عناصر الطبيعة', '{"positive": ["الإنسان الصالح", "الرزق", "العمر"], "negative": ["الموت إن قطعت"]}'),
('الحديقة', 'أماكن', '{"positive": ["الجنة", "الراحة", "العمل الصالح"], "negative": []}'),
('السيف', 'أشياء مادية', '{"positive": ["النصر", "القوة", "السلطان"], "negative": ["الخصومة والقتال"]}'),
('الكتاب', 'أشياء مادية', '{"positive": ["العلم والمعرفة", "البشارة"], "negative": []}')