import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Search, Star, StarOff, Trash2, Calendar, Loader2, Filter, X, ChevronDown, FileDown, FileText, Edit3 } from "lucide-react";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import jsPDF from "jspdf";

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
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [selectedSymbol, setSelectedSymbol] = useState<string>("");
  const [symbols, setSymbols] = useState<Array<{ id: string; symbol_name: string }>>([]);
  const [notes, setNotes] = useState<Record<string, string>>({});
  const { toast } = useToast();

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("dreamNotes");
    if (savedNotes) {
      try {
        setNotes(JSON.parse(savedNotes));
      } catch (error) {
        console.error("Error loading notes:", error);
      }
    }
  }, []);

  useEffect(() => {
    fetchDreams();
    fetchSymbols();
  }, []);

  useEffect(() => {
    filterDreams();
  }, [searchQuery, dreams, activeTab, dateFrom, dateTo, selectedSymbol]);

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

  const fetchSymbols = async () => {
    try {
      const { data, error } = await supabase
        .from("dream_symbols")
        .select("id, symbol_name")
        .order("symbol_name");

      if (error) throw error;
      setSymbols(data || []);
    } catch (error: any) {
      console.error("Error fetching symbols:", error);
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

    // Filter by date range
    if (dateFrom) {
      filtered = filtered.filter(
        (dream) => new Date(dream.created_at) >= dateFrom
      );
    }
    if (dateTo) {
      const endOfDay = new Date(dateTo);
      endOfDay.setHours(23, 59, 59, 999);
      filtered = filtered.filter(
        (dream) => new Date(dream.created_at) <= endOfDay
      );
    }

    // Filter by symbol
    if (selectedSymbol) {
      filtered = filtered.filter(
        (dream) =>
          dream.dream_text.toLowerCase().includes(selectedSymbol.toLowerCase()) ||
          dream.interpretation.toLowerCase().includes(selectedSymbol.toLowerCase())
      );
    }

    setFilteredDreams(filtered);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setDateFrom(undefined);
    setDateTo(undefined);
    setSelectedSymbol("");
  };

  const hasActiveFilters = searchQuery || dateFrom || dateTo || selectedSymbol;

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
      
      // Remove notes for deleted dream
      const updatedNotes = { ...notes };
      delete updatedNotes[id];
      setNotes(updatedNotes);
      localStorage.setItem("dreamNotes", JSON.stringify(updatedNotes));

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

  const updateNote = (dreamId: string, note: string) => {
    const updatedNotes = { ...notes, [dreamId]: note };
    setNotes(updatedNotes);
    localStorage.setItem("dreamNotes", JSON.stringify(updatedNotes));
  };

  const exportToPDF = () => {
    try {
      const doc = new jsPDF();
      
      // Load Arabic font support - using a system font
      doc.setFont("helvetica");
      
      let yPosition = 20;
      const pageHeight = doc.internal.pageSize.height;
      const lineHeight = 7;
      const margin = 20;
      const maxWidth = 170;

      // Title
      doc.setFontSize(18);
      doc.text("Dream Interpretations Archive", 105, yPosition, { align: "center" });
      yPosition += 15;

      const dreamsToExport = filteredDreams.length > 0 ? filteredDreams : dreams;

      dreamsToExport.forEach((dream, index) => {
        if (yPosition > pageHeight - 40) {
          doc.addPage();
          yPosition = 20;
        }

        // Dream number and date
        doc.setFontSize(12);
        doc.setFont("helvetica", "bold");
        const dreamDate = format(new Date(dream.created_at), "yyyy/MM/dd - HH:mm", { locale: ar });
        doc.text(`Dream #${index + 1} - ${dreamDate}`, margin, yPosition);
        yPosition += lineHeight + 2;

        // Dream text
        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.text("Dream:", margin, yPosition);
        yPosition += lineHeight;
        
        const dreamLines = doc.splitTextToSize(dream.dream_text, maxWidth);
        dreamLines.forEach((line: string) => {
          if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, margin, yPosition);
          yPosition += lineHeight;
        });

        yPosition += 3;

        // Interpretation
        doc.text("Interpretation:", margin, yPosition);
        yPosition += lineHeight;
        
        const interpretationLines = doc.splitTextToSize(dream.interpretation, maxWidth);
        interpretationLines.forEach((line: string) => {
          if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = 20;
          }
          doc.text(line, margin, yPosition);
          yPosition += lineHeight;
        });

        yPosition += 3;

        // Notes
        const dreamNote = notes[dream.id];
        if (dreamNote) {
          doc.text("Notes:", margin, yPosition);
          yPosition += lineHeight;
          
          const noteLines = doc.splitTextToSize(dreamNote, maxWidth);
          noteLines.forEach((line: string) => {
            if (yPosition > pageHeight - 30) {
              doc.addPage();
              yPosition = 20;
            }
            doc.text(line, margin, yPosition);
            yPosition += lineHeight;
          });
        }

        // Separator
        yPosition += 5;
        doc.line(margin, yPosition, 190, yPosition);
        yPosition += 10;
      });

      doc.save(`dreams_${format(new Date(), "yyyy-MM-dd")}.pdf`);
      
      toast({
        title: "تم التصدير بنجاح",
        description: `تم تصدير ${dreamsToExport.length} حلم إلى ملف PDF`,
      });
    } catch (error: any) {
      toast({
        title: "خطأ في التصدير",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const exportToCSV = () => {
    try {
      const dreamsToExport = filteredDreams.length > 0 ? filteredDreams : dreams;
      
      // Create CSV header
      const headers = ["التاريخ", "الحلم", "التفسير", "الملاحظات", "مفضل"];
      
      // Create CSV rows
      const rows = dreamsToExport.map(dream => [
        format(new Date(dream.created_at), "yyyy/MM/dd HH:mm", { locale: ar }),
        `"${dream.dream_text.replace(/"/g, '""')}"`,
        `"${dream.interpretation.replace(/"/g, '""')}"`,
        `"${(notes[dream.id] || "").replace(/"/g, '""')}"`,
        dream.is_favorite ? "نعم" : "لا"
      ]);
      
      // Combine headers and rows
      const csvContent = [
        headers.join(","),
        ...rows.map(row => row.join(","))
      ].join("\n");
      
      // Add BOM for proper UTF-8 encoding in Excel
      const BOM = "\uFEFF";
      const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
      
      // Create download link
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `dreams_${format(new Date(), "yyyy-MM-dd")}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast({
        title: "تم التصدير بنجاح",
        description: `تم تصدير ${dreamsToExport.length} حلم إلى ملف CSV`,
      });
    } catch (error: any) {
      toast({
        title: "خطأ في التصدير",
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
            {/* Search Bar */}
            <div className="space-y-3">
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

              {/* Advanced Filters Toggle and Export Buttons */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                    className="gap-2"
                  >
                    <Filter className="w-4 h-4" />
                    بحث متقدم
                    <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                  </Button>
                  
                  {hasActiveFilters && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearFilters}
                      className="gap-2 text-destructive hover:text-destructive"
                    >
                      <X className="w-4 h-4" />
                      مسح الفلاتر
                    </Button>
                  )}
                </div>

                {/* Export Buttons */}
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportToCSV}
                    className="gap-2"
                    disabled={dreams.length === 0}
                  >
                    <FileText className="w-4 h-4" />
                    تصدير CSV
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={exportToPDF}
                    className="gap-2"
                    disabled={dreams.length === 0}
                  >
                    <FileDown className="w-4 h-4" />
                    تصدير PDF
                  </Button>
                </div>
              </div>

              {/* Advanced Filters */}
              {showAdvancedFilters && (
                <div className="p-4 rounded-lg border border-primary/20 bg-muted/30 space-y-4 animate-in fade-in slide-in-from-top-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Date From */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium" dir="rtl">من تاريخ</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-right font-normal"
                          >
                            <Calendar className="ml-2 h-4 w-4" />
                            {dateFrom ? format(dateFrom, "PPP", { locale: ar }) : "اختر التاريخ"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={dateFrom}
                            onSelect={setDateFrom}
                            locale={ar}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* Date To */}
                    <div className="space-y-2">
                      <label className="text-sm font-medium" dir="rtl">إلى تاريخ</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-right font-normal"
                          >
                            <Calendar className="ml-2 h-4 w-4" />
                            {dateTo ? format(dateTo, "PPP", { locale: ar }) : "اختر التاريخ"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <CalendarComponent
                            mode="single"
                            selected={dateTo}
                            onSelect={setDateTo}
                            locale={ar}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>

                  {/* Symbol Filter */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium" dir="rtl">البحث حسب الرمز</label>
                    <Select value={selectedSymbol} onValueChange={setSelectedSymbol}>
                      <SelectTrigger className="w-full" dir="rtl">
                        <SelectValue placeholder="اختر رمزاً من الأحلام" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value=" ">الكل</SelectItem>
                        {symbols.map((symbol) => (
                          <SelectItem key={symbol.id} value={symbol.symbol_name}>
                            {symbol.symbol_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Active Filters Display */}
                  {hasActiveFilters && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-border">
                      {searchQuery && (
                        <Badge variant="secondary" className="gap-1">
                          بحث: {searchQuery}
                          <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery("")} />
                        </Badge>
                      )}
                      {dateFrom && (
                        <Badge variant="secondary" className="gap-1">
                          من: {format(dateFrom, "PP", { locale: ar })}
                          <X className="w-3 h-3 cursor-pointer" onClick={() => setDateFrom(undefined)} />
                        </Badge>
                      )}
                      {dateTo && (
                        <Badge variant="secondary" className="gap-1">
                          إلى: {format(dateTo, "PP", { locale: ar })}
                          <X className="w-3 h-3 cursor-pointer" onClick={() => setDateTo(undefined)} />
                        </Badge>
                      )}
                      {selectedSymbol && (
                        <Badge variant="secondary" className="gap-1">
                          رمز: {selectedSymbol}
                          <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSymbol("")} />
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              )}
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
                      note={notes[dream.id] || ""}
                      onUpdateNote={updateNote}
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
                      note={notes[dream.id] || ""}
                      onUpdateNote={updateNote}
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
  note: string;
  onUpdateNote: (dreamId: string, note: string) => void;
}

const DreamCard = ({ dream, onToggleFavorite, onDelete, note, onUpdateNote }: DreamCardProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [localNote, setLocalNote] = useState(note);

  useEffect(() => {
    setLocalNote(note);
  }, [note]);

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

            {/* Notes Section */}
            <div className="border-t border-border pt-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-sm text-muted-foreground flex items-center gap-2" dir="rtl">
                  <Edit3 className="w-4 h-4" />
                  ملاحظاتي الشخصية:
                </h4>
                {!isEditingNote && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditingNote(true)}
                    className="h-8 text-xs"
                  >
                    {localNote ? "تعديل" : "إضافة ملاحظة"}
                  </Button>
                )}
              </div>
              
              {isEditingNote ? (
                <div className="space-y-2">
                  <Input
                    value={localNote}
                    onChange={(e) => setLocalNote(e.target.value)}
                    placeholder="اكتب ملاحظاتك الشخصية هنا..."
                    className="w-full"
                    dir="rtl"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        onUpdateNote(dream.id, localNote);
                        setIsEditingNote(false);
                      }}
                    >
                      حفظ
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setLocalNote(note);
                        setIsEditingNote(false);
                      }}
                    >
                      إلغاء
                    </Button>
                  </div>
                </div>
              ) : (
                <p
                  className="text-foreground/80 text-sm leading-relaxed"
                  dir="rtl"
                >
                  {localNote || "لا توجد ملاحظات"}
                </p>
              )}
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
