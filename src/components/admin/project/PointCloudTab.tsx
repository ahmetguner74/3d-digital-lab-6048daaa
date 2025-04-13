import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import PointCloudViewer from "@/components/point-cloud/PointCloudViewer";

interface PointCloudTabProps {
  project: any;
  setProject: (project: any) => void;
  onPreview?: () => void;
}

export default function PointCloudTab({ project, setProject, onPreview }: PointCloudTabProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const handleSwitchChange = (checked: boolean) => {
    setProject((prev: any) => ({
      ...prev,
      haspointcloud: checked,
      ...(checked ? {} : { pointcloudpath: "" })
    }));
  };

  const handlePathChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProject((prev: any) => ({
      ...prev,
      pointcloudpath: e.target.value
    }));
  };

  const handlePreview = () => {
    if (project.pointcloudpath) {
      setPreviewOpen(true);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Nokta Bulutu Ayarları</CardTitle>
          <CardDescription>
            Projeye nokta bulutu ekleyin ve ayarlarını yapılandırın.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex items-center space-x-2">
              <Switch
                id="haspointcloud"
                checked={project.haspointcloud}
                onCheckedChange={handleSwitchChange}
              />
              <Label htmlFor="haspointcloud">Bu projede nokta bulutu kullanılsın</Label>
            </div>

            {project.haspointcloud && (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="pointcloudpath">Nokta Bulutu Yolu</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="pointcloudpath"
                      value={project.pointcloudpath || ""}
                      onChange={handlePathChange}
                      placeholder="örn: /pointclouds/project1/cloud.js"
                      className="flex-1"
                    />
                    {project.pointcloudpath && (
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={handlePreview}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Önizle
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Nokta bulutu dosyasının tam yolunu girin. Potree formatında bir dosya olmalıdır.
                  </p>
                </div>

                <div className="px-4 py-3 bg-muted rounded-md">
                  <h4 className="text-sm font-medium mb-2">Nokta Bulutu Bilgisi</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Nokta bulutu işlemesi için tarayıcı WebGL desteğine sahip olmalıdır.</li>
                    <li>• Büyük nokta bulutu dosyaları yüklenmesi zaman alabilir.</li>
                    <li>• Potree formatı .js uzantılı ana dosyaya ihtiyaç duyar.</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Nokta bulutu önizleme dialogu */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-5xl">
          <DialogHeader>
            <DialogTitle>Nokta Bulutu Önizleme</DialogTitle>
            <DialogDescription>
              {project.pointcloudpath} dosyası için nokta bulutu görüntüleyici
            </DialogDescription>
          </DialogHeader>
          
          <div className="h-[70vh] w-full">
            <PointCloudViewer pointCloudPath={project.pointcloudpath} />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
