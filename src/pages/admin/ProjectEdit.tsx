
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { X, Save, Loader2, Upload } from "lucide-react";

// Sample project data
const sampleProject = {
  id: 1,
  title: "Sivil Mimari Örneği",
  slug: "sivil-mimari",
  description: "Modern ve tarihi yapıların detaylı 3D tarama ve modellemesi",
  category: "Mimari",
  status: "Yayında",
  content: "Bu projede sivil mimari yapısının hem dış hem de iç kısımlarının lazer tarama teknolojisi kullanılarak milimetrik hassasiyetle 3D modelleri oluşturulmuştur. Tarama sonuçları, yapının mevcut durumunu detaylı şekilde belgelemekte ve olası restorasyon çalışmalarına temel oluşturmaktadır.",
  tags: ["Lazer Tarama", "3D Modelleme", "Mimari"],
  images: [
    { id: 1, url: "/placeholder.svg", alt: "Örnek görsel 1", type: "main" },
    { id: 2, url: "/placeholder.svg", alt: "Örnek görsel 2", type: "before" },
    { id: 3, url: "/placeholder.svg", alt: "Örnek görsel 3", type: "after" }
  ],
  hasPointCloud: true,
  lastUpdated: "2024-04-05"
};

export default function ProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = id === "new";
  
  const [project, setProject] = useState(isNew ? {
    id: null,
    title: "",
    slug: "",
    description: "",
    category: "",
    status: "Taslak",
    content: "",
    tags: [],
    images: [],
    hasPointCloud: false,
    lastUpdated: new Date().toISOString().split('T')[0]
  } : sampleProject);
  
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  
  useEffect(() => {
    if (!isNew && id) {
      // In a real implementation, this would fetch the project from Supabase
      // For now, we just use the sample data
      setLoading(true);
      setTimeout(() => {
        setProject(sampleProject);
        setLoading(false);
      }, 500);
    }
  }, [id, isNew]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
  };

  const handleTagAdd = () => {
    if (tagInput.trim() && !project.tags.includes(tagInput.trim())) {
      setProject(prev => ({ 
        ...prev, 
        tags: [...prev.tags, tagInput.trim()] 
      }));
      setTagInput("");
    }
  };
  
  const handleTagRemove = (tagToRemove: string) => {
    setProject(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };
  
  const handleSave = () => {
    setLoading(true);
    
    // In a real implementation, this would save to Supabase
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Proje kaydedildi",
        description: "Proje başarıyla kaydedildi.",
      });
      navigate("/admin/projects");
    }, 1000);
  };

  if (loading && !isNew) {
    return (
      <AdminLayout title="Proje Düzenleniyor">
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={isNew ? "Yeni Proje" : "Proje Düzenle"}>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">Genel</TabsTrigger>
          <TabsTrigger value="content">İçerik</TabsTrigger>
          <TabsTrigger value="media">Medya</TabsTrigger>
          <TabsTrigger value="settings">Ayarlar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>Genel Bilgiler</CardTitle>
              <CardDescription>
                Projenin temel bilgilerini buradan düzenleyebilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Proje Başlığı</Label>
                <Input
                  id="title"
                  name="title"
                  value={project.title}
                  onChange={handleChange}
                  placeholder="Proje başlığını girin"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="slug">SEO URL</Label>
                <Input
                  id="slug"
                  name="slug"
                  value={project.slug}
                  onChange={handleChange}
                  placeholder="proje-url-adresi"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Kısa Açıklama</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={project.description}
                  onChange={handleChange}
                  placeholder="Proje hakkında kısa bir açıklama yazın"
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori</Label>
                  <Select
                    value={project.category}
                    onValueChange={(value) => setProject(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Kategori seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Mimari">Mimari</SelectItem>
                      <SelectItem value="Arkeoloji">Arkeoloji</SelectItem>
                      <SelectItem value="Restorasyon">Restorasyon</SelectItem>
                      <SelectItem value="Müze">Müze</SelectItem>
                      <SelectItem value="Koruma">Koruma</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <Select
                    value={project.status}
                    onValueChange={(value) => setProject(prev => ({ ...prev, status: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Durum seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Taslak">Taslak</SelectItem>
                      <SelectItem value="Yayında">Yayında</SelectItem>
                      <SelectItem value="Arşiv">Arşiv</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Etiketler</Label>
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Etiket ekleyin"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleTagAdd();
                      }
                    }}
                  />
                  <Button type="button" onClick={handleTagAdd}>Ekle</Button>
                </div>
                
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tags.map((tag, index) => (
                    <div
                      key={index}
                      className="bg-primary/10 text-primary px-3 py-1 rounded-full flex items-center gap-1"
                    >
                      <span>{tag}</span>
                      <button
                        onClick={() => handleTagRemove(tag)}
                        className="hover:bg-primary/20 rounded-full"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="content">
          <Card>
            <CardHeader>
              <CardTitle>Proje İçeriği</CardTitle>
              <CardDescription>
                Proje hakkında detaylı bilgileri buradan düzenleyebilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="content">Detaylı Açıklama</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={project.content}
                  onChange={handleChange}
                  placeholder="Proje hakkında detaylı açıklama yazın"
                  rows={10}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Medya Dosyaları</CardTitle>
              <CardDescription>
                Projeye ait görselleri ve dosyaları buradan yönetebilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label className="block mb-2">Ana Görsel</Label>
                  <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-muted/50">
                    {project.images.find(img => img.type === 'main') ? (
                      <div className="relative w-full">
                        <img 
                          src={project.images.find(img => img.type === 'main')?.url} 
                          alt="Ana görsel"
                          className="w-full h-auto max-h-48 object-contain mx-auto"
                        />
                        <Button 
                          variant="destructive" 
                          size="icon"
                          className="absolute top-0 right-0"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Ana görseli yüklemek için tıklayın veya sürükleyin
                        </p>
                        <Button variant="secondary" size="sm" className="mt-4">
                          Dosya Seç
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="block mb-2">Öncesi Görseli</Label>
                    <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-muted/50">
                      {project.images.find(img => img.type === 'before') ? (
                        <div className="relative w-full">
                          <img 
                            src={project.images.find(img => img.type === 'before')?.url} 
                            alt="Öncesi görseli"
                            className="w-full h-auto max-h-36 object-contain mx-auto"
                          />
                          <Button 
                            variant="destructive" 
                            size="icon"
                            className="absolute top-0 right-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            "Öncesi" görseli
                          </p>
                          <Button variant="secondary" size="sm" className="mt-2">
                            Yükle
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="block mb-2">Sonrası Görseli</Label>
                    <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-muted/50">
                      {project.images.find(img => img.type === 'after') ? (
                        <div className="relative w-full">
                          <img 
                            src={project.images.find(img => img.type === 'after')?.url} 
                            alt="Sonrası görseli"
                            className="w-full h-auto max-h-36 object-contain mx-auto"
                          />
                          <Button 
                            variant="destructive" 
                            size="icon"
                            className="absolute top-0 right-0"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            "Sonrası" görseli
                          </p>
                          <Button variant="secondary" size="sm" className="mt-2">
                            Yükle
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="block mb-2">Ek Görseller</Label>
                  <div className="border border-dashed border-border rounded-lg p-6 bg-muted/50">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      <div className="aspect-square flex flex-col items-center justify-center bg-muted rounded-md border border-dashed border-border">
                        <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                        <p className="text-xs text-center text-muted-foreground">Görsel Ekle</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <input 
                    type="checkbox" 
                    id="hasPointCloud" 
                    checked={project.hasPointCloud}
                    onChange={(e) => setProject(prev => ({ ...prev, hasPointCloud: e.target.checked }))}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="hasPointCloud">Nokta bulutu görüntüleyici içerir</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Proje Ayarları</CardTitle>
              <CardDescription>
                Projenin gelişmiş ayarlarını buradan yapabilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Bu bölüm daha sonra genişletilecektir.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <div className="mt-6 flex items-center justify-end space-x-4">
          <Button variant="outline" onClick={() => navigate("/admin/projects")}>
            İptal
          </Button>
          <Button onClick={handleSave} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Kaydediliyor...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Kaydet
              </>
            )}
          </Button>
        </div>
      </Tabs>
    </AdminLayout>
  );
}
