
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { saveProject } from "./projectService";
import { ProjectFormData } from "@/components/projects/types";
import { ProjectFormLayout } from "./ProjectFormLayout";

interface ProjectFormProps {
  initialProject: ProjectFormData;
  isNew: boolean;
}

export default function ProjectForm({ initialProject, isNew }: ProjectFormProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [project, setProject] = useState<ProjectFormData>(initialProject);
  const [loading, setLoading] = useState(false);
  const [previewImages, setPreviewImages] = useState<{[key: string]: string}>({});
  const [deletedImageIds, setDeletedImageIds] = useState<string[]>([]);
  const [pointCloudPreviewOpen, setPointCloudPreviewOpen] = useState(false);

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

  const handlePointCloudPreview = () => {
    if (project.haspointcloud && project.pointcloudpath) {
      setPointCloudPreviewOpen(true);
    } else {
      toast({
        title: "Bilgi",
        description: "Nokta bulutu dosyası mevcut değil.",
        variant: "default"
      });
    }
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
      handlePointCloudPreview={handlePointCloudPreview}
      pointCloudPreviewOpen={pointCloudPreviewOpen}
      setPointCloudPreviewOpen={setPointCloudPreviewOpen}
      navigate={navigate}
    />
  );
}
