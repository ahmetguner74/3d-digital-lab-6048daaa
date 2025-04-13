
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { ProjectFormData } from "@/components/projects/types";

interface PointCloudTabProps {
  project: ProjectFormData;
  setProject: React.Dispatch<React.SetStateAction<ProjectFormData>>;
  onPreview: () => void;
}

export default function PointCloudTab({ project, setProject, onPreview }: PointCloudTabProps) {
  const handleSwitchChange = (checked: boolean) => {
    setProject({ ...project, haspointcloud: checked });
  };
  
  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProject({ ...project, pointcloudpath: e.target.value });
  };
  
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center space-x-2">
          <Switch 
            id="hasPointCloud" 
            checked={project.haspointcloud} 
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor="hasPointCloud">Bu proje için nokta bulutu var mı?</Label>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Nokta bulutu, projenizin 3D olarak görüntülenmesini sağlar. 
        </p>
      </div>
      
      {project.haspointcloud && (
        <div className="space-y-4">
          <div>
            <Label htmlFor="pointCloudPath">Nokta Bulutu Dosya Yolu</Label>
            <Input 
              id="pointCloudPath" 
              value={project.pointcloudpath || ""} 
              onChange={handlePathChange}
              placeholder="/pointclouds/proje-ismi/cloud.js"
              className="mt-1"
            />
            <p className="text-xs text-muted-foreground mt-1">
              PotreeConverter ile oluşturulan nokta bulutu dosyasının URL'sini girin. 
              Genellikle "cloud.js" ile biten bir yoldu.
            </p>
          </div>
          
          <div>
            <Button 
              variant="outline" 
              onClick={onPreview} 
              disabled={!project.pointcloudpath}
              type="button"
              className="flex items-center"
            >
              <Eye className="mr-2 h-4 w-4" />
              Nokta Bulutunu Önizle
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
