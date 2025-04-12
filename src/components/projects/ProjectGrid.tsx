
import ProjectCard from "./ProjectCard";
import { Project } from "./types";

interface ProjectGridProps {
  projects: Project[];
  className?: string;
}

export default function ProjectGrid({ projects, className = "" }: ProjectGridProps) {
  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-muted-foreground mb-4">Henüz yayınlanmış proje bulunmamaktadır.</p>
      </div>
    );
  }
  
  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16 ${className}`}>
      {projects.map((project) => (
        <ProjectCard key={project.id} project={project} />
      ))}
    </div>
  );
}
