import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Search, Star, StarOff, Trash2, Calendar, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";

interface Dream {
  id: string;
  dream_text: string;
  interpretation: string;
  is_favorite: boolean;
  created_at: string;
}

export const DreamHistory = () => {
  const [dreams, setDreams] = useState<Dream[]>([]);
  const [filteredDreams, setFilteredDreams] = useState<Dream[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    fetchDreams();
  }, []);

  useEffect(() => {
    filterDreams();
  }, [searchQuery, dreams, activeTab]);

  const fetchDreams = async () => {
    try {
      const { data, error } = await supabase
        .from("dreams")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setDreams(data || []);
    } catch (error: any) {
      toast({
        title: "خطأ في تحميل الأحلام",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filterDreams = () => {
    let filtered = dreams;

    // Filter by favorites
    if (activeTab === "favorites") {
      filtered = filtered.filter((dream) => dream.is_favorite);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      filtered = filtered.filter(
        (dream) =>
          dream.dream_text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          dream.interpretation.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredDreams(filtered);
  };

  const toggleFavorite = async (dream: Dream) => {
    try {
      const { error } = await supabase
        .from("dreams")
        .update({ is_favorite: !dream.is_favorite })
        .eq("id", dream.id);

      if (error) throw error;

      setDreams(
        dreams.map((d) =>
          d.id === dream.id ? { ...d, is_favorite: !d.is_favorite } : d
        )
      );

      toast({
        title: dream.is_favorite ? "تم إلغاء التمييز" : "تم التمييز كمفضل",
        description: dream.is_favorite
          ? "تم إزالة الحلم من المفضلة"
          : "تم إضافة الحلم إلى المفضلة",
      });
    } catch (error: any) {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const deleteDream = async (id: string) => {
    try {
      const { error } = await supabase.from("dreams").delete().eq("id", id);

      if (error) throw error;

      setDreams(dreams.filter((d) => d.id !== id));

      toast({
        title: "تم الحذف",
        description: "تم حذف الحلم بنجاح",
      });
    } catch (error: any) {
      toast({
        title: "خطأ في الحذف",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      <Card className="border-2 border-primary/20">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                type="text"
                placeholder="ابحث في أحلامك..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
                dir="rtl"
              />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="all">جميع الأحلام ({dreams.length})</TabsTrigger>
                <TabsTrigger value="favorites">
                  المفضلة ({dreams.filter((d) => d.is_favorite).length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-4 mt-4">
                {filteredDreams.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8" dir="rtl">
                    {searchQuery
                      ? "لا توجد نتائج للبحث"
                      : "لم تقم بتفسير أي حلم بعد"}
                  </p>
                ) : (
                  filteredDreams.map((dream) => (
                    <DreamCard
                      key={dream.id}
                      dream={dream}
                      onToggleFavorite={toggleFavorite}
                      onDelete={deleteDream}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="favorites" className="space-y-4 mt-4">
                {filteredDreams.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8" dir="rtl">
                    لا توجد أحلام مفضلة
                  </p>
                ) : (
                  filteredDreams.map((dream) => (
                    <DreamCard
                      key={dream.id}
                      dream={dream}
                      onToggleFavorite={toggleFavorite}
                      onDelete={deleteDream}
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

interface DreamCardProps {
  dream: Dream;
  onToggleFavorite: (dream: Dream) => void;
  onDelete: (id: string) => void;
}

const DreamCard = ({ dream, onToggleFavorite, onDelete }: DreamCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="border border-border/50 hover:border-primary/30 transition-colors">
      <CardContent className="pt-4">
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{format(new Date(dream.created_at), "PPP", { locale: ar })}</span>
            </div>
            <div className="flex gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleFavorite(dream)}
                className="h-8 w-8 p-0"
              >
                {dream.is_favorite ? (
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                ) : (
                  <StarOff className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(dream.id)}
                className="h-8 w-8 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1" dir="rtl">
                الحلم:
              </h4>
              <p
                className="text-foreground leading-relaxed"
                dir="rtl"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: isExpanded ? "unset" : 2,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {dream.dream_text}
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-1" dir="rtl">
                التفسير:
              </h4>
              <p
                className="text-foreground leading-relaxed"
                dir="rtl"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: isExpanded ? "unset" : 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                }}
              >
                {dream.interpretation}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full"
          >
            {isExpanded ? "عرض أقل" : "عرض المزيد"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
