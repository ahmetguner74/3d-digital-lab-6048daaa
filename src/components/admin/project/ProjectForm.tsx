
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Bileşenleri içe aktar
import GeneralInfoTab from "./GeneralInfoTab";
import ContentTab from "./ContentTab";
import MediaTab from "./MediaTab";
import PointCloudTab from "./PointCloudTab";
import SettingsTab from "./SettingsTab";

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

interface ProjectFormProps {
  initialProject: Project;
  isNew: boolean;
}

export default function ProjectForm({ initialProject, isNew }: ProjectFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [project, setProject] = useState<Project>(initialProject);
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState<{[key: string]: string}>({});
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);

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

      // Silinmiş görselleri veritabanından kaldır
      if (deletedImageIds.length > 0) {
        console.log("Silinecek görseller:", deletedImageIds);
        const { error: deleteError } = await supabase
          .from('project_images')
          .delete()
          .in('id', deletedImageIds);
          
        if (deleteError) {
          console.error("Görseller silinirken hata:", deleteError);
        }
      }

      // Önce-sonra görselleri için
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

      // Ek görseller için
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

  return (
    <>
      <Tabs defaultValue="general" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="general">Genel</TabsTrigger>
          <TabsTrigger value="content">İçerik</TabsTrigger>
          <TabsTrigger value="media">Medya</TabsTrigger>
          <TabsTrigger value="pointcloud">Nokta Bulutu</TabsTrigger>
          <TabsTrigger value="settings">Ayarlar</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general">
          <GeneralInfoTab project={project} setProject={setProject} />
        </TabsContent>
        
        <TabsContent value="content">
          <ContentTab project={project} setProject={setProject} />
        </TabsContent>
        
        <TabsContent value="media">
          <MediaTab 
            project={project} 
            setProject={setProject} 
            previewImages={previewImages} 
            setPreviewImages={setPreviewImages}
            setDeletedImageIds={setDeletedImageIds}
          />
        </TabsContent>
        
        <TabsContent value="pointcloud">
          <PointCloudTab project={project} setProject={setProject} />
        </TabsContent>
        
        <TabsContent value="settings">
          <SettingsTab project={project} setProject={setProject} />
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
    </>
  );
}
