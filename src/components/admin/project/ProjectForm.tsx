
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Loader2, Save } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

// Bileşenleri içe aktar
import GeneralInfoTab from "./GeneralInfoTab";
import ContentTab from "./ContentTab";
import MediaTab from "./MediaTab";
import PointCloudTab from "./PointCloudTab";
import SettingsTab from "./SettingsTab";
import { saveProject } from "./projectService";

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
    id: number | string;
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
      await saveProject({
        project,
        isNew,
        deletedImageIds,
        previewImages
      });
      
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

  return (
    <ProjectFormLayout
      project={project}
      setProject={setProject}
      previewImages={previewImages}
      setPreviewImages={setPreviewImages}
      setDeletedImageIds={setDeletedImageIds}
      loading={loading}
      handleSave={handleSave}
      handlePreview={handlePreview}
      navigate={navigate}
    />
  );
}

interface ProjectFormLayoutProps {
  project: Project;
  setProject: React.Dispatch<React.SetStateAction<Project>>;
  previewImages: {[key: string]: string};
  setPreviewImages: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
  setDeletedImageIds: React.Dispatch<React.SetStateAction<string[]>>;
  loading: boolean;
  handleSave: () => Promise<void>;
  handlePreview: () => void;
  navigate: (path: string) => void;
}

function ProjectFormLayout({
  project,
  setProject,
  previewImages,
  setPreviewImages,
  setDeletedImageIds,
  loading,
  handleSave,
  handlePreview,
  navigate
}: ProjectFormLayoutProps) {
  return (
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
      
      <FormActions
        project={project}
        loading={loading}
        handleSave={handleSave}
        handlePreview={handlePreview}
        navigate={navigate}
      />
    </Tabs>
  );
}

interface FormActionsProps {
  project: Project;
  loading: boolean;
  handleSave: () => Promise<void>;
  handlePreview: () => void;
  navigate: (path: string) => void;
}

function FormActions({ project, loading, handleSave, handlePreview, navigate }: FormActionsProps) {
  return (
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
  );
}
