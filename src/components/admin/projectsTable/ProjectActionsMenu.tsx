
import { useState } from "react";
import { Edit, Trash2, Eye, Star, Archive } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { ProjectDeleteDialog } from "./ProjectDeleteDialog";
import { Project } from "./types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface ProjectActionsMenuProps {
  project: Project;
  onRefresh: () => void;
}

export const ProjectActionsMenu = ({ project, onRefresh }: ProjectActionsMenuProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const viewProject = () => {
    window.open(`/projects/${project.slug}`, '_blank');
  };

  const editProject = () => {
    navigate(`/admin/projects/${project.id}/edit`);
  };

  const deleteProject = () => {
    setDeleteDialogOpen(true);
  };

  const toggleFeatured = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({ featured: !project.featured })
        .eq('id', project.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: `Proje ${!project.featured ? 'öne çıkarıldı' : 'öne çıkarılması kaldırıldı'}`,
        description: `${project.title} projesi ${!project.featured ? 'öne çıkarıldı' : 'öne çıkarılması kaldırıldı'}.`
      });
      
      onRefresh();
    } catch (error: any) {
      console.error('Proje güncellenirken hata:', error);
      toast({
        title: "Hata",
        description: `Proje güncellenirken bir sorun oluştu: ${error.message || error}`,
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const toggleArchive = async () => {
    const newStatus = project.status === 'Arşiv' ? 'Taslak' : 'Arşiv';
    
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', project.id);
      
      if (error) {
        throw error;
      }
      
      toast({
        title: `Proje ${newStatus === 'Arşiv' ? 'arşivlendi' : 'arşivden çıkarıldı'}`,
        description: `${project.title} projesi ${newStatus === 'Arşiv' ? 'arşivlendi' : 'arşivden çıkarıldı'}.`
      });
      
      onRefresh();
    } catch (error: any) {
      console.error('Proje durumu güncellenirken hata:', error);
      toast({
        title: "Hata",
        description: `Proje durumu güncellenirken bir sorun oluştu: ${error.message || error}`,
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Proje İşlemleri</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>İşlemler</DropdownMenuLabel>
          <DropdownMenuItem onClick={viewProject} disabled={isUpdating}>
            <Eye className="w-4 h-4 mr-2" /> Görüntüle
          </DropdownMenuItem>
          <DropdownMenuItem onClick={editProject} disabled={isUpdating}>
            <Edit className="w-4 h-4 mr-2" /> Düzenle
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={toggleFeatured} disabled={isUpdating}>
            <Star className={`w-4 h-4 mr-2 ${project.featured ? 'fill-yellow-400' : ''}`} />
            {project.featured ? 'Öne Çıkarma' : 'Öne Çıkar'}
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleArchive} disabled={isUpdating}>
            <Archive className="w-4 h-4 mr-2" />
            {project.status === 'Arşiv' ? 'Arşivden Çıkar' : 'Arşivle'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={deleteProject} 
            disabled={isUpdating}
            className="text-destructive focus:text-destructive"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Sil
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      
      <ProjectDeleteDialog 
        project={project} 
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen} 
        onRefresh={onRefresh}
      />
    </>
  );
};
