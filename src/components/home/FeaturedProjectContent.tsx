
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FeaturedProject } from "./ProjectsSection";

interface FeaturedProjectContentProps {
  project: FeaturedProject;
  dotIndicators: React.ReactNode;
}

export default function FeaturedProjectContent({ project, dotIndicators }: FeaturedProjectContentProps) {
  return (
    <div className="md:col-span-6 space-y-6 order-2 md:order-1">
      <div className="space-y-2">
        <div className="flex items-center mb-2">
          <h2 className="text-3xl md:text-4xl font-bold">
            {project.title}
          </h2>
          {dotIndicators}
        </div>
        <p className="text-primary font-medium">
          {project.category}
        </p>
      </div>
      
      <p className="text-muted-foreground text-lg">
        {project.description}
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
          <Link to={`/projects/${project.slug}`} className="flex items-center">
            İncele
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        
        <Button variant="outline" asChild size="lg">
          <Link to="/projects" className="flex items-center">
            Tüm Projeleri Gör
          </Link>
        </Button>
      </div>
    </div>
  );
}
