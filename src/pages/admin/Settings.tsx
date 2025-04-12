
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface SiteSettings {
  title: string;
  description: string;
  keywords: string;
  email: string;
  phone: string;
  address: string;
  facebook: string;
  twitter: string;
  instagram: string;
  linkedin: string;
  googleAnalyticsId: string;
  customScript: string;
}

const defaultSettings: SiteSettings = {
  title: "3D Mimari Dijitalleştirme Atölyesi",
  description: "3D lazer tarama, mimari modelleme ve kültürel miras dijitalleştirme çözümleri",
  keywords: "3D, lazer tarama, mimari, dijitalleştirme, kültürel miras",
  email: "info@3ddigitallab.com",
  phone: "+90 123 456 7890",
  address: "İstanbul, Türkiye",
  facebook: "",
  twitter: "",
  instagram: "",
  linkedin: "",
  googleAnalyticsId: "",
  customScript: ""
};

const websiteSettingsSchema = z.object({
  title: z.string().min(2, {
    message: "Site başlığı en az 2 karakterden oluşmalıdır.",
  }),
  description: z.string().min(10, {
    message: "Site açıklaması en az 10 karakterden oluşmalıdır.",
  }),
  keywords: z.string(),
  email: z.string().email({
    message: "Geçerli bir email adresi giriniz.",
  }),
  phone: z.string(),
  address: z.string(),
  facebook: z.string(),
  twitter: z.string(),
  instagram: z.string(),
  linkedin: z.string(),
  googleAnalyticsId: z.string(),
  customScript: z.string(),
});

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<SiteSettings>({
    resolver: zodResolver(websiteSettingsSchema),
    defaultValues: defaultSettings,
  });
  
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
            // Ayarlar bulunamadı, varsayılan ayarları kaydet
            await supabase
              .from('admin_settings')
              .insert({
                key: 'site_settings',
                value: defaultSettings
              });
          } else {
            throw error;
          }
        }
        
        if (data && data.value) {
          form.reset(data.value as SiteSettings);
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
  }, [form]);
  
  const onSubmit = async (values: SiteSettings) => {
    try {
      setSaving(true);
      
      const { error } = await supabase
        .from('admin_settings')
        .update({ value: values })
        .eq('key', 'site_settings');
      
      if (error) throw error;
      
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
        <TabsList className="mb-4">
          <TabsTrigger value="general">Genel Ayarlar</TabsTrigger>
          <TabsTrigger value="contact">İletişim Bilgileri</TabsTrigger>
          <TabsTrigger value="social">Sosyal Medya</TabsTrigger>
          <TabsTrigger value="advanced">Gelişmiş</TabsTrigger>
        </TabsList>
        
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <TabsContent value="general">
                <Card>
                  <CardHeader>
                    <CardTitle>Genel Site Ayarları</CardTitle>
                    <CardDescription>
                      Sitenizin temel SEO ve başlık ayarlarını yapın.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Başlığı</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Sitenizin başlığı tarayıcı sekmesinde ve arama motorlarında görünecektir.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Site Açıklaması</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="resize-none"
                              rows={3}
                            />
                          </FormControl>
                          <FormDescription>
                            Bu açıklama arama motoru sonuçlarında görüntülenecektir.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="keywords"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Anahtar Kelimeler</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Anahtar kelimeleri virgülle ayırın.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="contact">
                <Card>
                  <CardHeader>
                    <CardTitle>İletişim Bilgileri</CardTitle>
                    <CardDescription>
                      İletişim formunda ve sitenizde görünecek bilgiler.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-posta Adresi</FormLabel>
                          <FormControl>
                            <Input {...field} type="email" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Telefon Numarası</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Adres</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="resize-none"
                              rows={2}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="social">
                <Card>
                  <CardHeader>
                    <CardTitle>Sosyal Medya Hesapları</CardTitle>
                    <CardDescription>
                      Sosyal medya hesaplarınızın bağlantılarını ekleyin.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="facebook"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Facebook</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Facebook profil bağlantınızı ekleyin.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="twitter"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Twitter / X</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Twitter / X profil bağlantınızı ekleyin.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="instagram"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Instagram</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Instagram profil bağlantınızı ekleyin.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="linkedin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>LinkedIn</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            LinkedIn profil bağlantınızı ekleyin.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="advanced">
                <Card>
                  <CardHeader>
                    <CardTitle>Gelişmiş Ayarlar</CardTitle>
                    <CardDescription>
                      Analitik ve özel script ayarları.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <FormField
                      control={form.control}
                      name="googleAnalyticsId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Google Analytics ID</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormDescription>
                            Google Analytics izleme kimliğiniz (örn. UA-XXXXXXXXX-X).
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="customScript"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Özel Script</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              className="font-mono"
                              rows={5}
                            />
                          </FormControl>
                          <FormDescription>
                            Sayfanın head etiketinin içine eklenecek özel kodlar.
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <Button
                type="submit"
                className="ml-auto bg-blue-600 hover:bg-blue-700"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Ayarları Kaydet
                  </>
                )}
              </Button>
            </form>
          </Form>
        )}
      </Tabs>
    </AdminLayout>
  );
}
