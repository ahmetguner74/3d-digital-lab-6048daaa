
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import ProjectForm from "@/components/admin/project/ProjectForm";

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
  const [previewImages, setPreviewImages] = useState<{[key: string]: string}>({});
  
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
      console.error("Proje yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
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
      <ProjectForm initialProject={project} isNew={isNew} />
    </AdminLayout>
  );
}
