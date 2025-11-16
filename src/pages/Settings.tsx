import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Settings as SettingsIcon, Bell, Globe, Shield, Save } from "lucide-react";

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
