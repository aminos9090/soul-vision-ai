import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Bell, Globe, Shield, Save, Database, Download, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface UserSettings {
  language: "ar" | "en" | "fr";
  notifications: {
    dreamReminders: boolean;
    weeklyReport: boolean;
    newFeatures: boolean;
  };
  privacy: {
    profileVisibility: "public" | "private";
    shareAnalytics: boolean;
  };
}

const defaultSettings: UserSettings = {
  language: "ar",
  notifications: {
    dreamReminders: true,
    weeklyReport: false,
    newFeatures: true,
  },
  privacy: {
    profileVisibility: "private",
    shareAnalytics: false,
  },
};

export default function Settings() {
  const [settings, setSettings] = useState<UserSettings>(defaultSettings);
  const [hasChanges, setHasChanges] = useState(false);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const savedSettings = localStorage.getItem("userSettings");
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings));
      } catch (error) {
        console.error("Error loading settings:", error);
      }
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem("userSettings", JSON.stringify(settings));
    setHasChanges(false);
    toast({
      title: "تم حفظ الإعدادات",
      description: "تم حفظ تفضيلاتك بنجاح",
    });
  };

  const updateSettings = (updates: Partial<UserSettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const handleBackup = async () => {
    try {
      setIsBackingUp(true);
      
      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "خطأ",
          description: "يجب تسجيل الدخول أولاً",
          variant: "destructive",
        });
        return;
      }

      // Get dreams from database
      const { data: dreams, error } = await supabase
        .from("dreams")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      // Get notes from localStorage
      const notesData = localStorage.getItem("dreamNotes");
      const notes = notesData ? JSON.parse(notesData) : {};

      // Get settings from localStorage
      const settingsData = localStorage.getItem("userSettings");
      const userSettings = settingsData ? JSON.parse(settingsData) : defaultSettings;

      // Create backup object
      const backup = {
        version: "1.0",
        timestamp: new Date().toISOString(),
        data: {
          dreams: dreams || [],
          notes,
          settings: userSettings,
        },
      };

      // Download as JSON file
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `dream-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast({
        title: "تم إنشاء النسخة الاحتياطية",
        description: "تم تنزيل ملف النسخة الاحتياطية بنجاح",
      });
    } catch (error) {
      console.error("Backup error:", error);
      toast({
        title: "خطأ",
        description: "فشل إنشاء النسخة الاحتياطية",
        variant: "destructive",
      });
    } finally {
      setIsBackingUp(false);
    }
  };

  const handleRestore = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setIsRestoring(true);

      // Read file
      const text = await file.text();
      const backup = JSON.parse(text);

      // Validate backup structure
      if (!backup.version || !backup.data) {
        throw new Error("Invalid backup file");
      }

      // Get user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast({
          title: "خطأ",
          description: "يجب تسجيل الدخول أولاً",
          variant: "destructive",
        });
        return;
      }

      // Restore dreams to database
      if (backup.data.dreams && backup.data.dreams.length > 0) {
        const dreamsToInsert = backup.data.dreams.map((dream: any) => ({
          ...dream,
          user_id: user.id, // Ensure current user ID
          id: undefined, // Let database generate new IDs
        }));

        const { error } = await supabase
          .from("dreams")
          .insert(dreamsToInsert);

        if (error) throw error;
      }

      // Restore notes to localStorage
      if (backup.data.notes) {
        localStorage.setItem("dreamNotes", JSON.stringify(backup.data.notes));
      }

      // Restore settings to localStorage
      if (backup.data.settings) {
        localStorage.setItem("userSettings", JSON.stringify(backup.data.settings));
        setSettings(backup.data.settings);
      }

      toast({
        title: "تم استعادة البيانات",
        description: "تم استعادة البيانات بنجاح. قد تحتاج لتحديث الصفحة لرؤية التغييرات.",
      });

      // Reset file input
      event.target.value = "";
    } catch (error) {
      console.error("Restore error:", error);
      toast({
        title: "خطأ",
        description: "فشل استعادة البيانات. تأكد من أن الملف صحيح.",
        variant: "destructive",
      });
    } finally {
      setIsRestoring(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-primary/10 rounded-lg">
              <SettingsIcon className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">الإعدادات</h1>
              <p className="text-muted-foreground">إدارة تفضيلاتك وإعدادات التطبيق</p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Language Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-primary" />
                  <CardTitle>اللغة</CardTitle>
                </div>
                <CardDescription>اختر لغة التطبيق المفضلة</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={settings.language}
                  onValueChange={(value) =>
                    updateSettings({ language: value as "ar" | "en" | "fr" })
                  }
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="ar" id="ar" />
                    <Label htmlFor="ar" className="cursor-pointer">العربية</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="en" id="en" />
                    <Label htmlFor="en" className="cursor-pointer">English</Label>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <RadioGroupItem value="fr" id="fr" />
                    <Label htmlFor="fr" className="cursor-pointer">Français</Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Notification Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  <CardTitle>الإشعارات</CardTitle>
                </div>
                <CardDescription>تحكم في الإشعارات التي تريد استلامها</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="dream-reminders">تذكير تسجيل الأحلام</Label>
                    <p className="text-sm text-muted-foreground">
                      احصل على تذكير يومي لتسجيل أحلامك
                    </p>
                  </div>
                  <Switch
                    id="dream-reminders"
                    checked={settings.notifications.dreamReminders}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        notifications: {
                          ...settings.notifications,
                          dreamReminders: checked,
                        },
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weekly-report">التقرير الأسبوعي</Label>
                    <p className="text-sm text-muted-foreground">
                      احصل على ملخص أسبوعي لأحلامك وتفسيراتها
                    </p>
                  </div>
                  <Switch
                    id="weekly-report"
                    checked={settings.notifications.weeklyReport}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        notifications: {
                          ...settings.notifications,
                          weeklyReport: checked,
                        },
                      })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="new-features">الميزات الجديدة</Label>
                    <p className="text-sm text-muted-foreground">
                      احصل على إشعارات حول الميزات والتحديثات الجديدة
                    </p>
                  </div>
                  <Switch
                    id="new-features"
                    checked={settings.notifications.newFeatures}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        notifications: {
                          ...settings.notifications,
                          newFeatures: checked,
                        },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  <CardTitle>الخصوصية</CardTitle>
                </div>
                <CardDescription>إدارة خصوصية بياناتك</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label className="mb-3 block">ظهور الملف الشخصي</Label>
                  <RadioGroup
                    value={settings.privacy.profileVisibility}
                    onValueChange={(value) =>
                      updateSettings({
                        privacy: {
                          ...settings.privacy,
                          profileVisibility: value as "public" | "private",
                        },
                      })
                    }
                    className="space-y-3"
                  >
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="public" id="public" />
                      <Label htmlFor="public" className="cursor-pointer">
                        <div className="space-y-0.5">
                          <div>عام</div>
                          <p className="text-sm text-muted-foreground font-normal">
                            يمكن للجميع رؤية ملفك الشخصي
                          </p>
                        </div>
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2 space-x-reverse">
                      <RadioGroupItem value="private" id="private" />
                      <Label htmlFor="private" className="cursor-pointer">
                        <div className="space-y-0.5">
                          <div>خاص</div>
                          <p className="text-sm text-muted-foreground font-normal">
                            ملفك الشخصي مخفي عن الآخرين
                          </p>
                        </div>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="share-analytics">مشاركة بيانات الاستخدام</Label>
                    <p className="text-sm text-muted-foreground">
                      ساعدنا على تحسين التطبيق بمشاركة بيانات الاستخدام المجهولة
                    </p>
                  </div>
                  <Switch
                    id="share-analytics"
                    checked={settings.privacy.shareAnalytics}
                    onCheckedChange={(checked) =>
                      updateSettings({
                        privacy: {
                          ...settings.privacy,
                          shareAnalytics: checked,
                        },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>

            {/* Backup and Restore */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Database className="w-5 h-5 text-primary" />
                  <CardTitle>النسخ الاحتياطي والاستعادة</CardTitle>
                </div>
                <CardDescription>
                  قم بعمل نسخة احتياطية من أحلامك وملاحظاتك أو استعادتها
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <div className="flex items-start gap-2">
                    <Download className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-1">النسخ الاحتياطي</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        قم بتنزيل جميع أحلامك وملاحظاتك وإعداداتك كملف JSON
                      </p>
                      <Button
                        onClick={handleBackup}
                        disabled={isBackingUp}
                        variant="outline"
                        className="gap-2"
                      >
                        <Download className="w-4 h-4" />
                        {isBackingUp ? "جاري الإنشاء..." : "إنشاء نسخة احتياطية"}
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <div className="flex items-start gap-2">
                    <Upload className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-foreground mb-1">استعادة البيانات</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        استعد بياناتك من ملف النسخة الاحتياطية
                      </p>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={() => document.getElementById("restore-file")?.click()}
                          disabled={isRestoring}
                          variant="outline"
                          className="gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          {isRestoring ? "جاري الاستعادة..." : "اختر ملف للاستعادة"}
                        </Button>
                        <input
                          id="restore-file"
                          type="file"
                          accept=".json"
                          onChange={handleRestore}
                          className="hidden"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    ⚠️ <strong>تنبيه:</strong> عند استعادة البيانات، سيتم إضافة الأحلام الموجودة في النسخة الاحتياطية إلى أحلامك الحالية. لن يتم حذف أي بيانات موجودة.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            {hasChanges && (
              <Card className="bg-primary/5 border-primary/20">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      لديك تغييرات غير محفوظة
                    </p>
                    <Button onClick={handleSave} className="gap-2">
                      <Save className="w-4 h-4" />
                      حفظ التغييرات
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
