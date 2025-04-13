
import ProjectCard from "./ProjectCard";
import { Project } from "./types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

interface ProjectGridProps {
  projects: Project[];
  className?: string;
  isLoading?: boolean;
  error?: string | null;
}

export default function ProjectGrid({ 
  projects, 
  className = "", 
  isLoading = false,
  error = null 
}: ProjectGridProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-pulse flex space-x-4">
          <div className="h-12 w-12 rounded-full bg-slate-200"></div>
          <div className="space-y-2 w-full">
            <div className="h-4 bg-slate-200 rounded"></div>
            <div className="h-4 bg-slate-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mb-6">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }
  
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground mb-4">Henüz yayınlanmış proje bulunmamaktadır.</p>
        <p className="text-sm text-muted-foreground">Admin panelinden projeler ekleyebilir veya mevcut projeleri "Yayında" durumuna getirebilirsiniz.</p>
      </div>
    );
  }
  
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ${className}`}>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
