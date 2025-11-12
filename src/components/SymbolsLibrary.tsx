import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DreamSymbol {
  id: string;
  symbol_name: string;
  category: string;
  meanings: any;
}

const SymbolsLibrary = () => {
  const [symbols, setSymbols] = useState<DreamSymbol[]>([]);
  const [filteredSymbols, setFilteredSymbols] = useState<DreamSymbol[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSymbols();
  }, []);

  useEffect(() => {
    filterSymbols();
  }, [searchQuery, selectedCategory, symbols]);

  const fetchSymbols = async () => {
    try {
      const { data, error } = await supabase
        .from("dream_symbols")
        .select("*")
        .order("symbol_name");

      if (error) throw error;
      setSymbols(data || []);
    } catch (error) {
      console.error("Error fetching symbols:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterSymbols = () => {
    let filtered = symbols;

    if (searchQuery) {
      filtered = filtered.filter((symbol) =>
        symbol.symbol_name.includes(searchQuery)
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((symbol) => symbol.category === selectedCategory);
    }

    setFilteredSymbols(filtered);
  };

  const categories = Array.from(new Set(symbols.map((s) => s.category)));

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-lg text-muted-foreground">جارٍ التحميل...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <BookOpen className="w-8 h-8 text-primary" />
        <div>
          <h2 className="text-2xl font-bold text-foreground">مكتبة رموز الأحلام</h2>
          <p className="text-sm text-muted-foreground">
            اكتشف معاني الرموز الشائعة في الأحلام من المنظور الإسلامي
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
          <Input
            type="text"
            placeholder="ابحث عن رمز..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-[200px]">
            <SelectValue placeholder="اختر الفئة" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">جميع الفئات</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSymbols.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            لا توجد نتائج للبحث
          </div>
        ) : (
          filteredSymbols.map((symbol) => (
            <Card key={symbol.id} className="p-5 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <h3 className="text-xl font-bold text-foreground">{symbol.symbol_name}</h3>
                <Badge variant="secondary">{symbol.category}</Badge>
              </div>

              {symbol.meanings.positive.length > 0 && (
                <div className="mb-3">
                  <h4 className="text-sm font-semibold text-primary mb-2">✨ المعاني الإيجابية:</h4>
                  <ul className="space-y-1">
                    {symbol.meanings.positive.map((meaning, index) => (
                      <li key={index} className="text-sm text-foreground pr-4 relative before:content-['•'] before:absolute before:right-0">
                        {meaning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {symbol.meanings.negative.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-destructive mb-2">⚠️ المعاني السلبية:</h4>
                  <ul className="space-y-1">
                    {symbol.meanings.negative.map((meaning, index) => (
                      <li key={index} className="text-sm text-muted-foreground pr-4 relative before:content-['•'] before:absolute before:right-0">
                        {meaning}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default SymbolsLibrary;
