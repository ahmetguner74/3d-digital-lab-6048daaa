
import { Link } from "react-router-dom";
import { FeaturedProject } from "./FeaturedProjectsSlider";

interface FeaturedProjectImageProps {
  project: FeaturedProject;
}

export default function FeaturedProjectImage({ project }: FeaturedProjectImageProps) {
  return (
    <div className="md:col-span-6 aspect-video order-1 md:order-2">
      <Link to={`/projects/${project.slug}`}>
        <div className="relative w-full h-full overflow-hidden rounded-lg shadow-lg">
          <img 
            src={project.cover_image || "/placeholder.svg"} 
            alt={project.title} 
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = "/placeholder.svg";
            }}
          />
          <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/60 to-transparent text-white">
            <p className="text-sm md:text-base">Öne Çıkan Proje</p>
          </div>
        </div>
      </Link>
    </div>
  );
}
