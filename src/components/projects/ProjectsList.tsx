
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ProjectGrid from "./ProjectGrid";
import ProjectPagination from "./ProjectPagination";
import { useProjects } from "./useProjects";

interface ProjectsListProps {
  className?: string;
  projectsPerPage?: number;
}

export default function ProjectsList({ className = "", projectsPerPage = 9 }: ProjectsListProps) {
  const { 
    projects, 
    loading, 
    error, 
    currentPage, 
    totalPages, 
    handlePageChange 
  } = useProjects({ projectsPerPage });

  if (loading) {
    return (
      <div className={`${className} flex flex-col items-center justify-center py-12`}>
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Projeler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {error && (
        <div className="text-center py-4 mb-6">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="mt-2">
            Yeniden Dene
          </Button>
        </div>
      )}

      <ProjectGrid projects={projects} />
      
      <ProjectPagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        className="mt-12"
      />
    </div>
  );
}
