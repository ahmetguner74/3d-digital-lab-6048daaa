
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Project } from "./types";

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link 
      to={`/projects/${project.slug}`}
      className="group overflow-hidden bg-white dark:bg-muted/10 rounded-lg border border-muted shadow-sm hover:shadow-md transition-all duration-300 reveal"
    >
      <div className="aspect-video relative overflow-hidden">
        <img 
          src={project.cover_image || "/placeholder.svg"} 
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        {project.featured && (
          <div className="absolute top-3 right-3">
            <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
              Öne Çıkan
            </span>
          </div>
        )}
      </div>
      <div className="p-5">
        <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        {project.description && (
          <p className="mt-2 text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        )}
        <div className="flex justify-between items-center mt-3">
          <span className="text-sm font-medium text-primary/80">{project.category}</span>
          <div className="text-sm text-primary flex items-center">
            Detaylar <ArrowRight className="ml-1 h-3 w-3" />
          </div>
        </div>
      </div>
    </Link>
  );
}
