
import { Button } from "@/components/ui/button";
import { Loader2, Save, Eye } from "lucide-react";
import { ProjectFormData } from "@/components/projects/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Bileşenleri içe aktar
import GeneralInfoTab from "./GeneralInfoTab";
import ContentTab from "./ContentTab";
import MediaTab from "./MediaTab";
import PointCloudTab from "./PointCloudTab";
import SettingsTab from "./SettingsTab";
import PointCloudViewer from "@/components/point-cloud/PointCloudViewer";

interface ProjectFormLayoutProps {
  project: ProjectFormData;
  setProject: React.Dispatch<React.SetStateAction<ProjectFormData>>;
  previewImages: {[key: string]: string};
  setPreviewImages: React.Dispatch<React.SetStateAction<{[key: string]: string}>>;
  setDeletedImageIds: React.Dispatch<React.SetStateAction<string[]>>;
  loading: boolean;
  handleSave: () => Promise<void>;
  handlePreview: () => void;
  handlePointCloudPreview: () => void;
  pointCloudPreviewOpen: boolean;
  setPointCloudPreviewOpen: React.Dispatch<React.SetStateAction<boolean>>;
  navigate: (path: string) => void;
}

export function ProjectFormLayout({
  project,
  setProject,
  previewImages,
  setPreviewImages,
  setDeletedImageIds,
  loading,
  handleSave,
  handlePreview,
  handlePointCloudPreview,
  pointCloudPreviewOpen,
  setPointCloudPreviewOpen,
  navigate
}: ProjectFormLayoutProps) {
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
          <PointCloudTab 
            project={project} 
            setProject={setProject}
            onPreview={handlePointCloudPreview} 
          />
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
      
      {/* Nokta bulutu önizleme dialog'u */}
      <Dialog open={pointCloudPreviewOpen} onOpenChange={setPointCloudPreviewOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nokta Bulutu Önizlemesi: {project.title}</DialogTitle>
          </DialogHeader>
          {project.pointcloudpath && (
            <div className="h-[70vh] w-full">
              <PointCloudViewer pointCloudPath={project.pointcloudpath} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

interface FormActionsProps {
  project: ProjectFormData;
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
          <Eye className="mr-2 h-4 w-4" />
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
