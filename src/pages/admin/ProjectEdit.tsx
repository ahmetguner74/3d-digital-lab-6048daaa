
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
import { supabase } from "@/integrations/supabase/client";

interface Project {
  id: string | null;
  title: string;
  slug: string;
  description: string;
  category: string;
  status: string;
  content: string;
  featured: boolean;
  tags: string[];
  images: {
    id: number;
    url: string;
    alt: string;
    type: string;
  }[];
  additionalImages: {
    id: number;
    url: string;
    alt: string;
    type: string;
  }[];
  cover_image: string;
  hasPointCloud: boolean;
  pointCloudPath?: string;
  lastUpdated: string;
}

export default function ProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isNew = id === "new";
  
  const [project, setProject] = useState<Project>({
    id: null,
    title: "",
    slug: "",
    description: "",
    category: "",
    status: "Taslak",
    content: "",
    featured: false,
    tags: [],
    images: [],
    additionalImages: [],
    cover_image: "",
    hasPointCloud: false,
    lastUpdated: new Date().toISOString().split('T')[0]
  });
  
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [previewImages, setPreviewImages] = useState<{[key: string]: string}>({});
  
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const beforeImageInputRef = useRef<HTMLInputElement>(null);
  const afterImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImageInputRef = useRef<HTMLInputElement>(null);
  
  // Fetch project data if editing an existing project
  useEffect(() => {
    if (!isNew && id) {
      fetchProject(id);
    }
  }, [id, isNew]);
  
  // Fetch project data from Supabase
  const fetchProject = async (projectId: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
        
      if (error) {
        throw error;
      }
      
      if (data) {
        // Fetch project images
        const { data: imagesData, error: imagesError } = await supabase
          .from('project_images')
          .select('*')
          .eq('project_id', data.id)
          .order('sequence_order', { ascending: true });
          
        if (imagesError) {
          console.error('Proje görselleri yüklenirken hata:', imagesError);
        }
        
        // Process project data
        setProject({
          id: data.id,
          title: data.title,
          slug: data.slug,
          description: data.description || "",
          category: data.category,
          status: data.status,
          content: data.content || "",
          featured: data.featured || false,
          tags: [], // Şu an için tag özelliği yok
          cover_image: data.cover_image || "",
          images: data.cover_image ? [
            { id: 0, url: data.cover_image, alt: data.title, type: "main" }
          ] : [],
          additionalImages: imagesData ? imagesData.map((img: any, index: number) => ({
            id: img.id,
            url: img.image_url,
            alt: img.alt_text || `Görsel ${index + 1}`,
            type: "additional"
          })) : [],
          hasPointCloud: data.hasPointCloud || false,
          lastUpdated: new Date(data.updated_at).toISOString().split('T')[0]
        });
        
        // Set preview images
        if (data.cover_image) {
          setPreviewImages(prev => ({ ...prev, main: data.cover_image }));
        }
        
        if (imagesData && imagesData.length > 0) {
          // Set before and after images if they exist
          const beforeImage = imagesData.find(img => img.alt_text === "before");
          const afterImage = imagesData.find(img => img.alt_text === "after");
          
          if (beforeImage) {
            setPreviewImages(prev => ({ ...prev, before: beforeImage.image_url }));
          }
          
          if (afterImage) {
            setPreviewImages(prev => ({ ...prev, after: afterImage.image_url }));
          }
        }
      }
    } catch (error: any) {
      toast({
        title: "Hata",
        description: `Proje yüklenirken bir sorun oluştu: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProject(prev => ({ ...prev, [name]: value }));
    
    // Slug otomatik oluşturma
    if (name === "title" && (isNew || !project.slug)) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-ğüşıöçĞÜŞİÖÇ]/g, "") // Özel karakterleri kaldır
        .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s") // Türkçe karakterleri İngilizce'ye çevir
        .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
        .replace(/Ğ/g, "G").replace(/Ü/g, "U").replace(/Ş/g, "S")
        .replace(/İ/g, "I").replace(/Ö/g, "O").replace(/Ç/g, "C")
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
        if (type === "main") {
          setProject(prev => ({
            ...prev,
            cover_image: imageUrl
          }));
        } else if (type === "additional") {
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
          // Ana resimleri güncelle (before/after)
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
    } else if (type === "main") {
      // Ana görseli sil
      setProject(prev => ({
        ...prev,
        cover_image: ""
      }));
      
      // Önizleme resmini temizle
      setPreviewImages(prev => {
        const newPreviews = {...prev};
        delete newPreviews[type];
        return newPreviews;
      });
    } else {
      // Ana görsellerden birini sil (before/after)
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
    
    // Ana kapak görseli kontrolü
    if (type === "main" && project.cover_image) {
      return project.cover_image;
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
  
  const handleSave = async () => {
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

    try {
      // Proje verileri için hazırlık
      const projectData = {
        title: project.title,
        slug: project.slug,
        description: project.description,
        category: project.category,
        status: project.status,
        content: project.content,
        featured: project.featured,
        cover_image: project.cover_image,
        hasPointCloud: project.hasPointCloud,
        updated_at: new Date().toISOString()
      };
      
      let projectId = project.id;
      
      // Eğer yeni proje ise oluştur, değilse güncelle
      if (isNew) {
        const { data, error } = await supabase
          .from('projects')
          .insert([projectData])
          .select('id');
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          projectId = data[0].id;
        } else {
          throw new Error("Proje kaydedildi ancak ID alınamadı");
        }
      } else {
        const { error } = await supabase
          .from('projects')
          .update(projectData)
          .eq('id', project.id);
        
        if (error) {
          throw error;
        }
      }
      
      // Proje ID'si olmadan devam edemeyiz
      if (!projectId) {
        throw new Error("Proje ID'si alınamadı");
      }

      // Before/After görsellerini kaydet
      for (const imageType of ['before', 'after']) {
        const imageUrl = getImageUrl(imageType);
        if (imageUrl) {
          // Önce mevcut görselleri kontrol et
          const { data: existingImages } = await supabase
            .from('project_images')
            .select('id')
            .eq('project_id', projectId)
            .eq('alt_text', imageType);
          
          if (existingImages && existingImages.length > 0) {
            // Varolan görseli güncelle
            await supabase
              .from('project_images')
              .update({ image_url: imageUrl })
              .eq('id', existingImages[0].id);
          } else {
            // Yeni görsel ekle
            await supabase
              .from('project_images')
              .insert({
                project_id: projectId,
                image_url: imageUrl,
                alt_text: imageType,
                sequence_order: imageType === 'before' ? 0 : 1
              });
          }
        }
      }

      // Ek görselleri kaydet
      if (project.additionalImages && project.additionalImages.length > 0) {
        // Tüm ek görselleri çek ve DB'de olmayan yeni görselleri ekle
        const { data: existingImages } = await supabase
          .from('project_images')
          .select('*')
          .eq('project_id', projectId)
          .neq('alt_text', 'before')
          .neq('alt_text', 'after');
        
        const existingIds = existingImages ? existingImages.map(img => img.id) : [];
        
        // Önizlemeden gelen ve henüz DB'ye kaydedilmemiş görseller için
        const newImages = project.additionalImages.filter(img => 
          typeof img.id === 'number' || !existingIds.includes(img.id as string));
        
        if (newImages.length > 0) {
          const imagesToInsert = newImages.map((img, index) => ({
            project_id: projectId,
            image_url: img.url,
            alt_text: img.alt,
            sequence_order: existingImages ? existingImages.length + index + 2 : index + 2  // Before ve After'dan sonra
          }));
          
          await supabase
            .from('project_images')
            .insert(imagesToInsert);
        }
      }
      
      toast({
        title: "Başarılı",
        description: "Proje başarıyla kaydedildi.",
      });
      
      navigate("/admin/projects");
    } catch (error: any) {
      console.error("Proje kaydedilirken hata:", error);
      toast({
        title: "Hata",
        description: `Proje kaydedilirken bir sorun oluştu: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
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
                        <div key={typeof image.id === 'number' ? `temp-${image.id}` : image.id} className="aspect-square relative bg-background rounded-md border border-border overflow-hidden">
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
                  <Switch 
                    id="hasPointCloud" 
                    checked={project.hasPointCloud}
                    onCheckedChange={(checked) => setProject(prev => ({ ...prev, hasPointCloud: checked }))}
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
                      <Switch 
                        id="featured" 
                        checked={project.featured}
                        onCheckedChange={(checked) => setProject(prev => ({ ...prev, featured: checked }))}
                      />
                      <Label htmlFor="featured">Öne çıkan proje</Label>
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
            <Button variant="outline" onClick={handlePreview} disabled={!project.slug}>
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
