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
  haspointcloud: boolean;
  pointcloudpath?: string;
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
    haspointcloud: false,
    lastUpdated: new Date().toISOString().split('T')[0]
  });
  
  const [loading, setLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [previewImages, setPreviewImages] = useState<{[key: string]: string}>({});
  const [uploadingPointCloud, setUploadingPointCloud] = useState(false);
  const [pointCloudError, setPointCloudError] = useState<string | null>(null);
  
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const beforeImageInputRef = useRef<HTMLInputElement>(null);
  const afterImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImageInputRef = useRef<HTMLInputElement>(null);
  const pointCloudFileInputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (!isNew && id) {
      fetchProject(id);
    }
  }, [id, isNew]);
  
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
        const { data: imagesData, error: imagesError } = await supabase
          .from('project_images')
          .select('*')
          .eq('project_id', data.id)
          .order('sequence_order', { ascending: true });
          
        if (imagesError) {
          console.error('Proje görselleri yüklenirken hata:', imagesError);
        }
        
        setProject({
          id: data.id,
          title: data.title,
          slug: data.slug,
          description: data.description || "",
          category: data.category,
          status: data.status,
          content: data.content || "",
          featured: data.featured || false,
          tags: [],
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
          haspointcloud: data.haspointcloud || false,
          pointcloudpath: data.pointcloudpath || "",
          lastUpdated: new Date(data.updated_at).toISOString().split('T')[0]
        });
        
        if (data.cover_image) {
          setPreviewImages(prev => ({ ...prev, main: data.cover_image }));
        }
        
        if (imagesData && imagesData.length > 0) {
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
    
    if (name === "title" && (isNew || !project.slug)) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-ğüşıöçĞÜŞİÖÇ]/g, "")
        .replace(/ğ/g, "g").replace(/ü/g, "u").replace(/ş/g, "s")
        .replace(/ı/g, "i").replace(/ö/g, "o").replace(/ç/g, "c")
        .replace(/Ğ/g, "G").replace(/Ü/g, "U").replace(/Ş/g, "S")
        .replace(/İ/g, "I").replace(/Ö/g, "O").replace(/Ç/g, "C")
        .replace(/\s+/g, "-")
        .replace(/--+/g, "-");
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
        const imageUrl = reader.result as string;
        setPreviewImages(prev => ({...prev, [type]: imageUrl}));
        
        if (type === "main") {
          setProject(prev => ({
            ...prev,
            cover_image: imageUrl
          }));
        } else if (type === "additional") {
          const newImage = {
            id: Date.now(),
            url: imageUrl,
            alt: "Ek görsel",
            type: "additional"
          };
          
          setProject(prev => ({
            ...prev,
            additionalImages: [...(prev.additionalImages || []), newImage]
          }));
        } else {
          const imageIndex = project.images.findIndex(img => img.type === type);
          
          if (imageIndex >= 0) {
            setProject(prev => {
              const updatedImages = [...prev.images];
              updatedImages[imageIndex] = {
                ...updatedImages[imageIndex],
                url: imageUrl
              };
              return { ...prev, images: updatedImages };
            });
          } else {
            setProject(prev => ({
              ...prev,
              images: [
                ...prev.images,
                {
                  id: Date.now(),
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
      setProject(prev => ({
        ...prev,
        additionalImages: prev.additionalImages.filter(img => img.id !== id)
      }));
    } else if (type === "main") {
      setProject(prev => ({
        ...prev,
        cover_image: ""
      }));
      
      setPreviewImages(prev => {
        const newPreviews = {...prev};
        delete newPreviews[type];
        return newPreviews;
      });
    } else {
      setProject(prev => ({
        ...prev,
        images: prev.images.filter(img => img.type !== type)
      }));
      
      setPreviewImages(prev => {
        const newPreviews = {...prev};
        delete newPreviews[type];
        return newPreviews;
      });
    }
  };
  
  const getImageUrl = (type: string) => {
    if (previewImages[type]) {
      return previewImages[type];
    }
    
    if (type === "main" && project.cover_image) {
      return project.cover_image;
    }
    
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
  
  const handlePointCloudUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setUploadingPointCloud(true);
    setPointCloudError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const simulatedUrl = `https://storage.example.com/pointclouds/${file.name}`;
      setProject(prev => ({
        ...prev,
        pointcloudpath: simulatedUrl,
        haspointcloud: true
      }));
      toast({
        title: "Dosya Yüklendi",
        description: "Nokta bulutu dosyası başarıyla yüklendi.",
      });
    } catch (error: any) {
      console.error("Nokta bulutu yüklenirken hata:", error);
      setPointCloudError(error.message || "Nokta bulutu yüklenirken bir hata oluştu");
      toast({
        title: "Hata",
        description: `Nokta bulutu yüklenirken bir sorun oluştu: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setUploadingPointCloud(false);
    }
  };
  
  const triggerPointCloudUpload = () => {
    if (pointCloudFileInputRef.current) {
      pointCloudFileInputRef.current.click();
    }
  };
  
  const removePointCloud = () => {
    setProject(prev => ({
      ...prev,
      pointcloudpath: "",
      haspointcloud: false
    }));
    
    toast({
      title: "Nokta Bulutu Kaldırıldı",
      description: "Nokta bulutu dosyası başarıyla kaldırıldı.",
    });
  };
  
  const handleSave = async () => {
    setLoading(true);
    
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
      const projectData = {
        title: project.title,
        slug: project.slug,
        description: project.description,
        category: project.category,
        status: project.status,
        content: project.content,
        featured: project.featured,
        cover_image: project.cover_image,
        haspointcloud: project.haspointcloud,
        pointcloudpath: project.pointcloudpath,
        updated_at: new Date().toISOString()
      };
      
      let projectId = project.id;
      
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
      
      if (!projectId) {
        throw new Error("Proje ID'si alınamadı");
      }

      for (const imageType of ['before', 'after']) {
        const imageUrl = getImageUrl(imageType);
        if (imageUrl) {
          const { data: existingImages } = await supabase
            .from('project_images')
            .select('id')
            .eq('project_id', projectId)
            .eq('alt_text', imageType);
          
          if (existingImages && existingImages.length > 0) {
            await supabase
              .from('project_images')
              .update({ image_url: imageUrl })
              .eq('id', existingImages[0].id);
          } else {
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

      if (project.additionalImages && project.additionalImages.length > 0) {
        const { data: existingImages } = await supabase
          .from('project_images')
          .select('*')
          .eq('project_id', projectId)
          .neq('alt_text', 'before')
          .neq('alt_text', 'after');
        
        const existingIds = existingImages ? existingImages.map(img => img.id) : [];
        
        const newImages = project.additionalImages.filter(img => 
          typeof img.id === 'number' || !existingIds.includes(img.id as string));
        
        if (newImages.length > 0) {
          const imagesToInsert = newImages.map((img, index) => ({
            project_id: projectId,
            image_url: img.url,
            alt_text: img.alt,
            sequence_order: existingImages ? existingImages.length + index + 2 : index + 2
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
          <TabsTrigger value="pointcloud">Nokta Bulutu</TabsTrigger>
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
                    id="haspointcloud" 
                    checked={project.haspointcloud}
                    onCheckedChange={(checked) => setProject(prev => ({ ...prev, haspointcloud: checked }))}
                  />
                  <Label htmlFor="haspointcloud">Nokta bulutu görüntüleyici içerir</Label>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="pointcloud">
          <Card>
            <CardHeader>
              <CardTitle>Nokta Bulutu Yönetimi</CardTitle>
              <CardDescription>
                3D nokta bulutu dosyalarınızı bu alandan yükleyebilir ve yönetebilirsiniz.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="haspointcloud" 
                    checked={project.haspointcloud}
                    onCheckedChange={(checked) => setProject(prev => ({ ...prev, haspointcloud: checked }))}
                  />
                  <Label htmlFor="haspointcloud">Bu proje nokta bulutu görüntüleyici içerir</Label>
                </div>
                <p className="text-sm text-muted-foreground">
                  Nokta bulutu görüntüleyici etkinleştirildiğinde, proje detay sayfasında interaktif 3D nokta bulutu görüntüleyicisi gösterilir.
                </p>
              </div>
              
              {project.haspointcloud && (
                <div className="space-y-4">
                  <div className="border border-dashed border-border rounded-lg p-6 bg-muted/50">
                    {project.pointcloudpath ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">Yüklenen Nokta Bulutu</h4>
                            <p className="text-sm text-muted-foreground break-all mt-1">
                              {project.pointcloudpath}
                            </p>
                          </div>
                          <Button 
                            variant="destructive" 
                            size="sm" 
                            onClick={removePointCloud}
                          >
                            <X className="h-4 w-4 mr-1" /> Kaldır
                          </Button>
                        </div>
                        
                        <div className="bg-primary/5 p-4 rounded-md border border-primary/20">
                          <h4 className="font-medium text-sm flex items-center">
                            <Check className="h-4 w-4 text-primary mr-1" />
                            Dosya Yüklendi
                          </h4>
                          <p className="text-xs text-muted-foreground mt-1">
                            Bu dosya proje kaydedildiğinde kullanılacaktır.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-6">
                        <div className="bg-primary/5 rounded-full p-4 mb-4">
                          <Upload className="h-8 w-8 text-primary" />
                        </div>
                        <h4 className="font-medium mb-2">Nokta Bulutu Yükleme</h4>
                        <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                          Potree formatında nokta bulutu dosyasını (.js uzantılı cloud.js dosyası) yükleyin veya doğrudan URL'sini aşağıdaki alana girin.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
                          <Button 
                            onClick={triggerPointCloudUpload}
                            disabled={uploadingPointCloud}
                            className="flex-1"
                          >
                            {uploadingPointCloud ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Yükleniyor...
                              </>
                            ) : (
                              <>
                                <Upload className="mr-2 h-4 w-4" />
                                Dosya Seç
                              </>
                            )}
                          </Button>
                          
                          <div className="text-center text-muted-foreground py-2">veya</div>
                          
                          <Input
                            placeholder="Nokta bulutu URL'si"
                            value={project.pointcloudpath || ""}
                            onChange={(e) => setProject(prev => ({ ...prev, pointcloudpath: e.target.value }))}
                            className="flex-1"
                          />
                        </div>
                        
                        <input
                          ref={pointCloudFileInputRef}
                          type="file"
                          accept=".js"
                          className="hidden"
                          onChange={handlePointCloudUpload}
                        />
                        
                        {pointCloudError && (
                          <div className="mt-4 text-destructive text-sm flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-1" />
                            {pointCloudError}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="pointcloudpath">Nokta Bulutu URL</Label>
                    <Input
                      id="pointcloudpath"
                      placeholder="https://example.com/pointclouds/project/cloud.js"
                      value={project.pointcloudpath || ""}
                      onChange={(e) => setProject(prev => ({ ...prev, pointcloudpath: e.target.value }))}
                    />
                    <p className="text-xs text-muted-foreground">
                      Potree formatında nokta bulutu dosyasının URL'sini girin. Dosya cloud.js ile bitmelidir.
                    </p>
                  </div>
                  
                  <div className="bg-muted/50 p-4 rounded-md border border-border">
                    <h4 className="font-medium mb-2 flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
                      Önemli Bilgi
                    </h4>
                    <div className="text-sm text-muted-foreground space-y-2">
                      <p>
                        Nokta bulutu dosyaları büyük olabilir ve özel bir sunucu yapılandırması gerektirebilir. 
                        Aşağıdaki hususları dikkate alın:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Potree formatında bir nokta bulutu dosyası kullanın</li>
                        <li>Ana dosya cloud.js olmalı ve tüm ilgili veri dosyalarına erişilebilmelidir</li>
                        <li>Dosyalar CORS erişimine izin veren bir sunucuda barındırılmalıdır</li>
                        <li>Büyük dosyalar için CDN kullanımı önerilir</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}
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
                
                {project.haspointcloud && (
                  <div className="space-y-2">
                    <Label htmlFor="pointcloudpath">Nokta Bulutu Yolu</Label>
                    <Input
                      id="pointcloudpath"
                      name="pointcloudpath"
                      value={project.pointcloudpath || ""}
                      onChange={(e) => setProject(prev => ({ ...prev, pointcloudpath: e.target.value }))}
                      placeholder="Nokta bulutu dosya yolu (örn: https://example.com/pointcloud/project.js)"
                    />
                    <p className="text-xs text-muted-foreground">
                      Potree formatında nokta bulutu dosyasının URL'sini girin (cloud.js uzantılı)
                    </p>
                  </div>
                )}
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
