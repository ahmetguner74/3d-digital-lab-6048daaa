
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FeaturedProject } from "./types/FeaturedProject";

export function ProjectCard({ project }: { project: FeaturedProject }) {
  return (
    <div className="rounded-xl overflow-hidden bg-card border shadow-sm h-full flex flex-col">
      <div className="relative h-48 overflow-hidden">
        <Link to={`/projects/${project.slug}`}>
          <img 
            src={project.cover_image || "/placeholder.svg"} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </Link>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        {project.category && (
          <span className="inline-block bg-primary/10 text-primary text-xs font-semibold px-2.5 py-1 rounded-full mb-2">
            {project.category}
          </span>
        )}
        <h3 className="text-lg font-semibold mb-2">
          <Link to={`/projects/${project.slug}`} className="hover:text-primary transition-colors">
            {project.title}
          </Link>
        </h3>
        <p className="text-muted-foreground text-sm line-clamp-3 flex-1">{project.description}</p>
        <div className="mt-4">
          <Button asChild variant="outline" size="sm" className="w-full">
            <Link to={`/projects/${project.slug}`}>Detaylar</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
