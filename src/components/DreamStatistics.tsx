import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { Brain, TrendingUp, Calendar, Star } from "lucide-react";
import { toast } from "sonner";

interface Dream {
  id: string;
  dream_text: string;
  interpretation: string;
  is_favorite: boolean;
  created_at: string;
}

interface MonthlyData {
  month: string;
  count: number;
}

interface SymbolFrequency {
  symbol: string;
  count: number;
}

export const DreamStatistics = () => {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalDreams, setTotalDreams] = useState(0);
  const [favoriteDreams, setFavoriteDreams] = useState(0);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [symbolFrequency, setSymbolFrequency] = useState<SymbolFrequency[]>([]);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("dreams")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const dreamsData = data || [];
      setDreams(dreamsData);
      setTotalDreams(dreamsData.length);
      setFavoriteDreams(dreamsData.filter(d => d.is_favorite).length);

      // حساب البيانات الشهرية
      const monthlyStats = calculateMonthlyStats(dreamsData);
      setMonthlyData(monthlyStats);

      // حساب تكرار الرموز
      const symbols = await calculateSymbolFrequency(dreamsData);
      setSymbolFrequency(symbols);

    } catch (error) {
      console.error("Error fetching statistics:", error);
      toast.error("فشل تحميل الإحصائيات");
    } finally {
      setLoading(false);
    }
  };

  const calculateMonthlyStats = (dreams: Dream[]): MonthlyData[] => {
    const monthCounts: { [key: string]: number } = {};
    const monthNames = [
      "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
      "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"
    ];

    dreams.forEach(dream => {
      const date = new Date(dream.created_at);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthCounts[monthKey] = (monthCounts[monthKey] || 0) + 1;
    });

    const last6Months: MonthlyData[] = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      last6Months.push({
        month: monthNames[d.getMonth()],
        count: monthCounts[monthKey] || 0
      });
    }

    return last6Months;
  };

  const calculateSymbolFrequency = async (dreams: Dream[]): Promise<SymbolFrequency[]> => {
    try {
      const { data: symbols } = await supabase
        .from("dream_symbols")
        .select("symbol_name");

      if (!symbols) return [];

      const symbolCounts: { [key: string]: number } = {};

      dreams.forEach(dream => {
        const text = dream.dream_text.toLowerCase();
        symbols.forEach(symbol => {
          if (text.includes(symbol.symbol_name)) {
            symbolCounts[symbol.symbol_name] = (symbolCounts[symbol.symbol_name] || 0) + 1;
          }
        });
      });

      return Object.entries(symbolCounts)
        .map(([symbol, count]) => ({ symbol, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

    } catch (error) {
      console.error("Error calculating symbol frequency:", error);
      return [];
    }
  };

  const COLORS = [
    'hsl(var(--primary))',
    'hsl(var(--secondary))',
    'hsl(var(--accent))',
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-xl">جارٍ التحميل...</div>
      </div>
    );
  }

  if (totalDreams === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <Brain className="w-16 h-16 mx-auto text-muted-foreground opacity-50" />
        <p className="text-muted-foreground text-lg">
          لم تقم بتفسير أي أحلام بعد
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2 mb-8">
        <div className="flex items-center justify-center gap-3">
          <TrendingUp className="w-8 h-8 text-primary animate-pulse" />
          <h2 className="text-4xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            إحصائيات أحلامي
          </h2>
        </div>
        <p className="text-muted-foreground text-lg">
          تحليل شامل لأحلامك ورحلتك الروحانية
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-2 hover:border-primary/50 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Brain className="w-5 h-5 text-primary" />
              إجمالي الأحلام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-primary">{totalDreams}</p>
            <p className="text-sm text-muted-foreground mt-2">حلم مفسر</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500" />
              الأحلام المفضلة
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-amber-500">{favoriteDreams}</p>
            <p className="text-sm text-muted-foreground mt-2">من أصل {totalDreams}</p>
          </CardContent>
        </Card>

        <Card className="border-2 hover:border-primary/50 transition-all">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Calendar className="w-5 h-5 text-secondary" />
              معدل الأحلام
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-secondary">
              {(totalDreams / 6).toFixed(1)}
            </p>
            <p className="text-sm text-muted-foreground mt-2">حلم شهريًا (آخر 6 أشهر)</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            الأحلام خلال الأشهر الستة الماضية
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <Line 
                type="monotone" 
                dataKey="count" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', r: 5 }}
                name="عدد الأحلام"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {symbolFrequency.length > 0 && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              أكثر الرموز تكرارًا في أحلامك
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={symbolFrequency}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="symbol" 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  labelStyle={{ color: 'hsl(var(--foreground))' }}
                />
                <Bar dataKey="count" name="عدد التكرارات">
                  {symbolFrequency.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {symbolFrequency.length > 0 && (
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="w-5 h-5" />
              توزيع الرموز الأكثر شيوعًا
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={symbolFrequency.slice(0, 5)}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ symbol, percent }) => `${symbol} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {symbolFrequency.slice(0, 5).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
