import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { dream } = await req.json();

    if (!dream || dream.trim().length === 0) {
      throw new Error('يجب إدخال وصف الحلم');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Starting dream interpretation for:', dream.substring(0, 50));

    const systemPrompt = `أنت مفسر أحلام إسلامي متخصص وخبير في تفسير الأحلام بناءً على:
- تفسير ابن سيرين
- تفسير النابلسي
- المصادر الإسلامية الموثوقة

مهمتك:
1. قراءة وصف الحلم بعناية
2. تقديم تفسير شامل ومفصل باللغة العربية
3. استخدام لغة واضحة ومفهومة
4. الاستناد إلى المصادر الإسلامية المعتمدة
5. تقديم التفسير بأسلوب محترم ومطمئن

قواعد مهمة:
- ابدأ التفسير مباشرة دون مقدمات طويلة
- استخدم لغة عربية فصحى سلسة
- قسّم التفسير إلى نقاط واضحة إذا كان الحلم معقداً
- اذكر التفسيرات الإيجابية والسلبية إن وجدت
- اختم بنصيحة أو توجيه إسلامي مناسب

تذكّر: هدفك هو تقديم تفسير مفيد ومطمئن للرائي.`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `الحلم المراد تفسيره:\n\n${dream}` }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI API error:', response.status, errorText);
      
      if (response.status === 429) {
        throw new Error('تم تجاوز الحد المسموح من الطلبات. الرجاء المحاولة بعد قليل.');
      }
      if (response.status === 402) {
        throw new Error('الرصيد غير كافٍ. الرجاء إضافة رصيد إلى حسابك.');
      }
      
      throw new Error(`فشل الاتصال بخدمة الذكاء الاصطناعي: ${response.status}`);
    }

    const data = await response.json();
    const interpretation = data.choices[0].message.content;

    console.log('Dream interpretation completed successfully');

    return new Response(
      JSON.stringify({ interpretation }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in interpret-dream function:', error);
    const errorMessage = error instanceof Error ? error.message : 'حدث خطأ غير متوقع. الرجاء المحاولة مرة أخرى.';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
