
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Cube, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Project } from "@/components/projects/types";

interface ProjectPointCloudProps {
  project: Project;
}

export default function ProjectPointCloud({ project }: ProjectPointCloudProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!project.haspointcloud || !project.pointcloudpath) return null;
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mt-12">
      <div className="bg-muted/30 rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold flex items-center">
            <Cube className="mr-2 h-5 w-5 text-primary" />
            3D Nokta Bulutu Görüntüleyici
          </h3>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={toggleExpand}>
              {isExpanded ? "Küçült" : "Genişlet"}
            </Button>
            <Button variant="default" size="sm" asChild>
              <Link to={`/3d-viewer?path=${encodeURIComponent(project.pointcloudpath)}&title=${encodeURIComponent(project.title)}`} target="_blank" className="flex items-center gap-1">
                <span>Tam Ekran</span>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        <div className={`relative overflow-hidden rounded-md border border-muted ${isExpanded ? 'h-[70vh]' : 'aspect-video'} transition-all duration-300`}>
          <iframe 
            src={`/3d-viewer?path=${encodeURIComponent(project.pointcloudpath)}&embed=true`} 
            className="w-full h-full"
            title={`${project.title} 3D Nokta Bulutu`}
          />
        </div>
        
        <p className="mt-4 text-sm text-muted-foreground">
          Bu projede 3D nokta bulutu verisi mevcuttur. Daha detaylı incelemek için "Tam Ekran" butonuna tıklayarak nokta bulutu görüntüleyicisinde açabilirsiniz.
        </p>
      </div>
    </div>
  );
}
