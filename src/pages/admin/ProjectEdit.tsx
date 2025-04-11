
import { useState, useEffect, useRef } from "react";
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
import { X, Save, Loader2, Upload, ImagePlus, Check, AlertTriangle } from "lucide-react";

// Örnek proje verisi
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
  additionalImages: [],
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
    additionalImages: [],
    hasPointCloud: false,
    lastUpdated: new Date().toISOString().split('T')[0]
  } : sampleProject);
  
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [previewImages, setPreviewImages] = useState<{[key: string]: string}>({});
  
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const beforeImageInputRef = useRef<HTMLInputElement>(null);
  const afterImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImageInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (!isNew && id) {
      // Gerçek uygulamada Supabase'den proje verisini çekecek
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
    
    // Slug otomatik oluşturma
    if (name === "title" && isNew) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, "") // Özel karakterleri kaldır
        .replace(/\s+/g, "-") // Boşlukları tire ile değiştir
        .replace(/--+/g, "-"); // Çoklu tireleri tek tire yap
      setProject(prev => ({ ...prev, slug }));
    }
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
  
  const handleImageUpload = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        // URL oluştur ve önizleme için kaydet
        const imageUrl = reader.result as string;
        setPreviewImages(prev => ({...prev, [type]: imageUrl}));
        
        // Resim türüne göre projeyi güncelle
        if (type === "additional") {
          // Ek görseller dizisine ekle
          const newImage = {
            id: Date.now(), // Geçici ID
            url: imageUrl,
            alt: "Ek görsel",
            type: "additional"
          };
          
          setProject(prev => ({
            ...prev,
            additionalImages: [...(prev.additionalImages || []), newImage]
          }));
        } else {
          // Ana resimleri güncelle
          const imageIndex = project.images.findIndex(img => img.type === type);
          
          if (imageIndex >= 0) {
            // Varolan resmi güncelle
            setProject(prev => {
              const updatedImages = [...prev.images];
              updatedImages[imageIndex] = {
                ...updatedImages[imageIndex],
                url: imageUrl
              };
              return { ...prev, images: updatedImages };
            });
          } else {
            // Yeni resim ekle
            setProject(prev => ({
              ...prev,
              images: [
                ...prev.images,
                {
                  id: Date.now(), // Geçici ID
                  url: imageUrl,
                  alt: `${type} görsel`,
                  type
                }
              ]
            }));
          }
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = (type: string, id?: number) => {
    if (type === "additional" && id) {
      // Ek görseli sil
      setProject(prev => ({
        ...prev,
        additionalImages: prev.additionalImages.filter(img => img.id !== id)
      }));
    } else {
      // Ana görsellerden birini sil
      setProject(prev => ({
        ...prev,
        images: prev.images.filter(img => img.type !== type)
      }));
      
      // Önizleme resmini temizle
      setPreviewImages(prev => {
        const newPreviews = {...prev};
        delete newPreviews[type];
        return newPreviews;
      });
    }
  };
  
  // Ön izleme URL'si al
  const getImageUrl = (type: string) => {
    // Önce yeni yüklenen resmi kontrol et
    if (previewImages[type]) {
      return previewImages[type];
    }
    
    // Varolan proje resmini kontrol et
    const image = project.images.find(img => img.type === type);
    if (image) {
      return image.url;
    }
    
    return null;
  };
  
  const triggerImageUpload = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      ref.current.click();
    }
  };
  
  const handleSave = () => {
    setLoading(true);
    
    // Zorunlu alanların kontrolü
    if (!project.title || !project.category || !project.description) {
      toast({
        title: "Hata",
        description: "Lütfen gerekli tüm alanları doldurun.",
        variant: "destructive"
      });
      setLoading(false);
      return;
    }
    
    // Gerçek uygulamada, bu fonksiyon Supabase'e veri kaydedecek
    setTimeout(() => {
      setLoading(false);
      toast({
        title: "Proje kaydedildi",
        description: "Proje başarıyla kaydedildi.",
      });
      navigate("/admin/projects");
    }, 1000);
  };

  const handlePreview = () => {
    // Yeni sekmede önizleme için
    // Gerçek uygulamada, dinamik proje detay sayfasına yönlendirecek
    window.open(`/projects/${project.slug}`, '_blank');
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
                <Label htmlFor="title">Proje Başlığı <span className="text-destructive">*</span></Label>
                <Input
                  id="title"
                  name="title"
                  value={project.title}
                  onChange={handleChange}
                  placeholder="Proje başlığını girin"
                  required
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
                <p className="text-xs text-muted-foreground">
                  Boş bırakırsanız, başlıktan otomatik oluşturulacaktır.
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Kısa Açıklama <span className="text-destructive">*</span></Label>
                <Textarea
                  id="description"
                  name="description"
                  value={project.description}
                  onChange={handleChange}
                  placeholder="Proje hakkında kısa bir açıklama yazın"
                  rows={3}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Kategori <span className="text-destructive">*</span></Label>
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
              <div className="space-y-6">
                <div>
                  <Label className="block mb-2">Ana Görsel</Label>
                  <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-muted/50">
                    {getImageUrl('main') ? (
                      <div className="relative w-full">
                        <img 
                          src={getImageUrl('main')} 
                          alt="Ana görsel"
                          className="w-full h-auto max-h-48 object-contain mx-auto"
                        />
                        <Button 
                          variant="destructive" 
                          size="icon"
                          className="absolute top-0 right-0"
                          onClick={() => removeImage('main')}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        
                        <div className="absolute bottom-2 right-2">
                          <Button 
                            variant="secondary"
                            size="sm"
                            onClick={() => triggerImageUpload(mainImageInputRef)}
                            className="flex items-center"
                          >
                            <ImagePlus className="h-4 w-4 mr-1" />
                            Değiştir
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Ana görseli yüklemek için tıklayın veya sürükleyin
                        </p>
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          className="mt-4"
                          onClick={() => triggerImageUpload(mainImageInputRef)}
                        >
                          Dosya Seç
                        </Button>
                      </div>
                    )}
                    
                    <input
                      ref={mainImageInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleImageUpload('main', e)}
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="block mb-2">Öncesi Görseli</Label>
                    <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-muted/50">
                      {getImageUrl('before') ? (
                        <div className="relative w-full">
                          <img 
                            src={getImageUrl('before')} 
                            alt="Öncesi görseli"
                            className="w-full h-auto max-h-36 object-contain mx-auto"
                          />
                          <Button 
                            variant="destructive" 
                            size="icon"
                            className="absolute top-0 right-0"
                            onClick={() => removeImage('before')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          
                          <div className="absolute bottom-2 right-2">
                            <Button 
                              variant="secondary"
                              size="sm"
                              onClick={() => triggerImageUpload(beforeImageInputRef)}
                              className="flex items-center"
                            >
                              <ImagePlus className="h-4 w-4 mr-1" />
                              Değiştir
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            "Öncesi" görseli
                          </p>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => triggerImageUpload(beforeImageInputRef)}
                          >
                            Yükle
                          </Button>
                        </div>
                      )}
                      
                      <input
                        ref={beforeImageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload('before', e)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label className="block mb-2">Sonrası Görseli</Label>
                    <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-muted/50">
                      {getImageUrl('after') ? (
                        <div className="relative w-full">
                          <img 
                            src={getImageUrl('after')} 
                            alt="Sonrası görseli"
                            className="w-full h-auto max-h-36 object-contain mx-auto"
                          />
                          <Button 
                            variant="destructive" 
                            size="icon"
                            className="absolute top-0 right-0"
                            onClick={() => removeImage('after')}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          
                          <div className="absolute bottom-2 right-2">
                            <Button 
                              variant="secondary"
                              size="sm"
                              onClick={() => triggerImageUpload(afterImageInputRef)}
                              className="flex items-center"
                            >
                              <ImagePlus className="h-4 w-4 mr-1" />
                              Değiştir
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="text-center">
                          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                          <p className="text-sm text-muted-foreground">
                            "Sonrası" görseli
                          </p>
                          <Button 
                            variant="secondary" 
                            size="sm" 
                            className="mt-2"
                            onClick={() => triggerImageUpload(afterImageInputRef)}
                          >
                            Yükle
                          </Button>
                        </div>
                      )}
                      
                      <input
                        ref={afterImageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload('after', e)}
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label className="block mb-2">Ek Görseller</Label>
                  <div className="border border-dashed border-border rounded-lg p-6 bg-muted/50">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {/* Ek görselleri göster */}
                      {project.additionalImages && project.additionalImages.map((image) => (
                        <div key={image.id} className="aspect-square relative bg-background rounded-md border border-border overflow-hidden">
                          <img 
                            src={image.url} 
                            alt={image.alt} 
                            className="object-cover w-full h-full"
                          />
                          <Button 
                            variant="destructive" 
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => removeImage('additional', image.id)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                      
                      {/* Yeni görsel ekleme butonu */}
                      <div 
                        className="aspect-square flex flex-col items-center justify-center bg-muted rounded-md border border-dashed border-border cursor-pointer hover:bg-muted/80 transition-colors"
                        onClick={() => triggerImageUpload(additionalImageInputRef)}
                      >
                        <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                        <p className="text-xs text-center text-muted-foreground">Görsel Ekle</p>
                      </div>
                      
                      <input
                        ref={additionalImageInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImageUpload('additional', e)}
                      />
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
              <div className="space-y-6">
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">SEO Ayarları</h3>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="metaTitle">Meta Başlık</Label>
                      <Input
                        id="metaTitle"
                        name="metaTitle"
                        placeholder="Meta başlık (boş bırakılırsa proje başlığı kullanılır)"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="metaDescription">Meta Açıklama</Label>
                      <Textarea
                        id="metaDescription"
                        name="metaDescription"
                        placeholder="Meta açıklama (boş bırakılırsa kısa açıklama kullanılır)"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <h3 className="text-lg font-medium">Görünürlük Ayarları</h3>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="featured" 
                        className="h-4 w-4"
                      />
                      <Label htmlFor="featured">Öne çıkan proje</Label>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <input 
                        type="checkbox" 
                        id="hideFromListing" 
                        className="h-4 w-4"
                      />
                      <Label htmlFor="hideFromListing">Liste sayfasında gizle</Label>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/30 rounded-lg">
                  <div className="flex items-start">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 mr-3 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800 dark:text-yellow-300">Dikkat</h4>
                      <p className="text-sm text-yellow-700 dark:text-yellow-400 mt-1">
                        Bu bölümdeki ayarlar henüz geliştirilme aşamasındadır. İleride daha fazla özellik eklenecektir.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <div className="mt-6 flex items-center justify-between space-x-4">
          <Button variant="outline" onClick={() => navigate("/admin/projects")}>
            İptal
          </Button>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={handlePreview}>
              Önizle
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
        </div>
      </Tabs>
    </AdminLayout>
  );
}
