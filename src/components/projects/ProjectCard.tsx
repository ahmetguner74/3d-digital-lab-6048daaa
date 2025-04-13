
import { Link } from "react-router-dom";
import { Project } from "./types";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  project: Project;
  variant?: "default" | "featured" | "compact";
  className?: string;
}

export default function ProjectCard({ 
  project, 
  variant = "default", 
  className = "" 
}: ProjectCardProps) {
  // Modern tasarımlı proje kartı
  if (variant === "featured") {
    return (
      <div className={`group relative overflow-hidden rounded-xl border bg-background shadow-sm transition-all ${className}`}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          {/* Sol taraf - Görsel */}
          <div className="relative overflow-hidden h-60 lg:h-auto">
            <img
              src={project.cover_image || "/placeholder.svg"}
              alt={project.title}
              className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder.svg";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 lg:opacity-100"></div>
          </div>
          
          {/* Sağ taraf - İçerik */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              {project.category && (
                <Badge variant="outline" className="mb-3 text-xs font-medium">{project.category}</Badge>
              )}
              <h3 className="text-2xl font-bold mb-3 group-hover:text-primary transition-colors">
                {project.title}
              </h3>
              <p className="text-muted-foreground line-clamp-3 mb-4">
                {project.description}
              </p>
            </div>
            
            <Button asChild className="w-fit mt-2" variant="default">
              <Link to={`/projects/${project.slug}`} className="flex items-center gap-2">
                İncele
                <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
  
  // Kompakt tasarımlı kart
  if (variant === "compact") {
    return (
      <Link 
        to={`/projects/${project.slug}`}
        className={`group block relative overflow-hidden rounded-lg border bg-background shadow-sm transition-all hover:shadow-md ${className}`}
      >
        <div className="aspect-[16/9] relative overflow-hidden">
          <img
            src={project.cover_image || "/placeholder.svg"}
            alt={project.title}
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
          <div className="absolute bottom-2 left-2">
            {project.category && (
              <Badge variant="secondary" className="text-xs">{project.category}</Badge>
            )}
          </div>
        </div>
        <div className="p-3">
          <h3 className="font-semibold text-base truncate group-hover:text-primary transition-colors">
            {project.title}
          </h3>
        </div>
      </Link>
    );
  }
  
  // Varsayılan kart tasarımı
  return (
    <div className={`group relative overflow-hidden rounded-xl border bg-background shadow-sm hover:shadow-md transition-all ${className}`}>
      <div className="aspect-[4/3] relative overflow-hidden">
        <img
          src={project.cover_image || "/placeholder.svg"}
          alt={project.title}
          className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/placeholder.svg";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
        <div className="absolute top-2 left-2">
          {project.category && (
            <Badge variant="secondary" className="text-xs">{project.category}</Badge>
          )}
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2 group-hover:text-primary transition-colors">
          {project.title}
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-3">
          {project.description}
        </p>
        <Link 
          to={`/projects/${project.slug}`}
          className="text-sm font-medium text-primary inline-flex items-center hover:underline"
        >
          Detayları Gör
          <ArrowRight size={14} className="ml-1" />
        </Link>
      </div>
    </div>
  );
}
