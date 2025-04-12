
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { SiteSettings, fromSiteSettings, toSiteSettings } from "@/types/supabase-extensions";
import { Link } from "react-router-dom";

export default function AdminSettings() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<SiteSettings>({
    title: "3D Dijital Lab",
    description: "3D lazer tarama ve modelleme çözümleri",
    keywords: "3D, lazer tarama, mimari, dijitalleştirme",
    email: "info@example.com",
    phone: "+90123456789",
    address: "İstanbul, Türkiye",
    facebook: "",
    twitter: "",
    instagram: "",
    linkedin: "",
    googleAnalyticsId: "",
    customScript: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('admin_settings')
          .select('*')
          .eq('key', 'site_settings')
          .single();
          
        if (error) {
          if (error.code === 'PGRST116') {
            // Kayıt bulunamadı, varsayılan ayarları kullan
            console.log("Ayarlar bulunamadı, varsayılan ayarlar kullanılacak");
          } else {
            throw error;
          }
        } else if (data && data.value) {
          // Tip uyumsuzluğunu önlemek için toSiteSettings dönüşüm fonksiyonunu kullan
          setSettings(toSiteSettings(data.value));
        }
      } catch (error) {
        console.error("Ayarlar yüklenirken hata:", error);
        toast({
          title: "Hata",
          description: "Ayarlar yüklenirken bir hata oluştu.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchSettings();
  }, [toast]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async () => {
    try {
      setSaving(true);
      
      // Tip dönüşümü için fromSiteSettings kullan
      const settingsValue = fromSiteSettings(settings);
      
      const { data, error } = await supabase
        .from('admin_settings')
        .select('id')
        .eq('key', 'site_settings')
        .maybeSingle();
        
      if (error) throw error;
      
      if (data) {
        // Var olan kaydı güncelle
        const { error: updateError } = await supabase
          .from('admin_settings')
          .update({ value: settingsValue })
          .eq('id', data.id);
          
        if (updateError) throw updateError;
      } else {
        // Yeni kayıt oluştur
        const { error: insertError } = await supabase
          .from('admin_settings')
          .insert({ 
            key: 'site_settings', 
            value: settingsValue 
          });
          
        if (insertError) throw insertError;
      }
      
      toast({
        title: "Ayarlar kaydedildi",
        description: "Site ayarları başarıyla güncellendi."
      });
    } catch (error) {
      console.error("Ayarlar kaydedilirken hata:", error);
      toast({
        title: "Hata",
        description: "Ayarlar kaydedilirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <AdminLayout title="Ayarlar">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Ayarlar">
      <div className="flex items-center space-x-2 mb-4">
        <Button variant="outline" size="sm" asChild>
          <Link to="/admin/dashboard" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Dashboard'a Dön</span>
          </Link>
        </Button>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">Genel Ayarlar</TabsTrigger>
          <TabsTrigger value="contact">İletişim</TabsTrigger>
          <TabsTrigger value="social">Sosyal Medya</TabsTrigger>
          <TabsTrigger value="advanced">Gelişmiş</TabsTrigger>
        </TabsList>
        
        <div className="mt-6">
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Genel Ayarlar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium">Site Başlığı</label>
                  <Input
                    id="title"
                    name="title"
                    value={settings.title}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="description" className="text-sm font-medium">Site Açıklaması</label>
                  <Textarea
                    id="description"
                    name="description"
                    value={settings.description}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="keywords" className="text-sm font-medium">Anahtar Kelimeler (virgülle ayırın)</label>
                  <Input
                    id="keywords"
                    name="keywords"
                    value={settings.keywords}
                    onChange={handleChange}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="contact">
            <Card>
              <CardHeader>
                <CardTitle>İletişim Bilgileri</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">Email</label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={settings.email}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">Telefon</label>
                  <Input
                    id="phone"
                    name="phone"
                    value={settings.phone}
                    onChange={handleChange}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium">Adres</label>
                  <Textarea
                    id="address"
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Sosyal Medya Bağlantıları</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="facebook" className="text-sm font-medium">Facebook URL</label>
                  <Input
                    id="facebook"
                    name="facebook"
                    value={settings.facebook}
                    onChange={handleChange}
                    placeholder="https://facebook.com/..."
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="twitter" className="text-sm font-medium">Twitter URL</label>
                  <Input
                    id="twitter"
                    name="twitter"
                    value={settings.twitter}
                    onChange={handleChange}
                    placeholder="https://twitter.com/..."
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="instagram" className="text-sm font-medium">Instagram URL</label>
                  <Input
                    id="instagram"
                    name="instagram"
                    value={settings.instagram}
                    onChange={handleChange}
                    placeholder="https://instagram.com/..."
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="linkedin" className="text-sm font-medium">LinkedIn URL</label>
                  <Input
                    id="linkedin"
                    name="linkedin"
                    value={settings.linkedin}
                    onChange={handleChange}
                    placeholder="https://linkedin.com/in/..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Gelişmiş Ayarlar</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="googleAnalyticsId" className="text-sm font-medium">Google Analytics ID</label>
                  <Input
                    id="googleAnalyticsId"
                    name="googleAnalyticsId"
                    value={settings.googleAnalyticsId}
                    onChange={handleChange}
                    placeholder="G-XXXXXXXXXX"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="customScript" className="text-sm font-medium">Özel HTML/JavaScript Kodu</label>
                  <Textarea
                    id="customScript"
                    name="customScript"
                    value={settings.customScript}
                    onChange={handleChange}
                    rows={5}
                    placeholder="<script>...</script>"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
      
      <div className="mt-6 flex justify-end">
        <Button 
          onClick={handleSubmit} 
          disabled={saving}
          className="flex items-center gap-2"
        >
          {saving ? 
            <Loader2 className="h-4 w-4 animate-spin" /> : 
            <Save className="h-4 w-4" />
          }
          {saving ? "Kaydediliyor..." : "Kaydet"}
        </Button>
      </div>
    </AdminLayout>
  );
}
