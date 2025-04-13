
import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, Copy, Edit, Eye, Loader2, 
  MoreVertical, Trash2, XCircle 
} from "lucide-react";
import { 
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, 
  DropdownMenuSeparator, DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Project } from "./types";
import { ProjectDeleteDialog } from "./ProjectDeleteDialog";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProjectActionsMenuProps {
  project: Project;
  onRefresh: () => void;
}

export const ProjectActionsMenu = ({ project, onRefresh }: ProjectActionsMenuProps) => {
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [processingAction, setProcessingAction] = useState<string | null>(null);

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', project.id);
      
      if (error) throw error;
      
      toast({
        title: "Proje silindi",
        description: "Proje başarıyla silindi.",
      });
      
      onRefresh();
    } catch (error) {
      console.error("Proje silinirken hata:", error);
      toast({
        title: "Hata",
        description: "Proje silinirken bir hata oluştu.",
        variant: "destructive"
      });
    }
  };

  const handleDuplicate = async () => {
    try {
      setProcessingAction(`duplicate-${project.id}`);
      
      const { data: projectToDuplicate, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', project.id)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (projectToDuplicate) {
        const newSlug = `${projectToDuplicate.slug}-kopya-${Date.now().toString().slice(-5)}`;
        
        const duplicatedProject = {
          ...projectToDuplicate,
          id: undefined,
          title: `${projectToDuplicate.title} (Kopya)`,
          slug: newSlug,
          status: "Taslak",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        delete duplicatedProject.id;
        
        const { error: insertError } = await supabase
          .from('projects')
          .insert(duplicatedProject);
        
        if (insertError) throw insertError;
        
        toast({
          title: "Proje kopyalandı",
          description: "Proje kopyası oluşturuldu ve taslak olarak kaydedildi.",
        });
        
        onRefresh();
      }
    } catch (error) {
      console.error("Proje kopyalanırken hata:", error);
      toast({
        title: "Hata",
        description: "Proje kopyalanırken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(null);
    }
  };

  const toggleFeatured = async () => {
    try {
      setProcessingAction(`feature-${project.id}`);
      
      const { error } = await supabase
        .from('projects')
        .update({ featured: !project.featured })
        .eq('id', project.id);
      
      if (error) throw error;
      
      toast({
        title: project.featured 
          ? "Öne çıkarma kaldırıldı" 
          : "Öne çıkarmaya eklendi",
        description: project.featured 
          ? "Proje artık öne çıkan projeler arasında gösterilmeyecek." 
          : "Proje öne çıkan projeler arasına eklendi.",
      });
      
      onRefresh();
    } catch (error) {
      console.error("Proje öne çıkarma durumu değiştirilirken hata:", error);
      toast({
        title: "Hata",
        description: "Proje öne çıkarma durumu değiştirilirken bir hata oluştu.",
        variant: "destructive"
      });
    } finally {
      setProcessingAction(null);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">İşlemler</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem asChild>
            <Link to={`/projects/${project.slug}`} target="_blank" className="flex items-center">
              <Eye className="mr-2 h-4 w-4" />
              <span>Görüntüle</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to={`/admin/projects/${project.id}`} className="flex items-center">
              <Edit className="mr-2 h-4 w-4" />
              <span>Düzenle</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={handleDuplicate}
            disabled={processingAction === `duplicate-${project.id}`}
            className="flex items-center"
          >
            {processingAction === `duplicate-${project.id}` ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Copy className="mr-2 h-4 w-4" />
            )}
            <span>Kopyala</span>
          </DropdownMenuItem>
          <DropdownMenuItem 
            onClick={toggleFeatured}
            disabled={processingAction === `feature-${project.id}`}
            className="flex items-center"
          >
            {processingAction === `feature-${project.id}` ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : project.featured ? (
              <XCircle className="mr-2 h-4 w-4" />
            ) : (
              <CheckCircle2 className="mr-2 h-4 w-4" />
            )}
            <span>
              {project.featured ? "Öne çıkarmayı kaldır" : "Öne çıkar"}
            </span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            className="text-destructive focus:text-destructive"
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Sil</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProjectDeleteDialog 
        open={deleteDialogOpen} 
        onOpenChange={setDeleteDialogOpen} 
        onDelete={handleDelete} 
      />
    </>
  );
};
