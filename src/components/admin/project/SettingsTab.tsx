
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SettingsTabProps {
  project: any;
  setProject: (project: any) => void;
}

export default function SettingsTab({ project, setProject }: SettingsTabProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proje Ayarları</CardTitle>
        <CardDescription>
          Projenin gelişmiş ayarlarını buradan yapabilirsiniz.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">SEO Ayarları</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="metaTitle">Meta Başlık</Label>
                <Input
                  id="metaTitle"
                  name="metaTitle"
                  placeholder="Meta başlık (boş bırakılırsa proje başlığı kullanılır)"
                />
              </div>
              
              <div>
                <Label htmlFor="metaDescription">Meta Açıklama</Label>
                <Textarea
                  id="metaDescription"
                  name="metaDescription"
                  placeholder="Meta açıklama (boş bırakılırsa kısa açıklama kullanılır)"
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Görünürlük Ayarları</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="featured" 
                  checked={project.featured}
                  onCheckedChange={(checked) => setProject(prev => ({ ...prev, featured: checked }))}
                />
                <Label htmlFor="featured">Öne çıkan proje</Label>
              </div>
            </div>
          </div>
          
          {project.haspointcloud && (
            <div className="space-y-2">
              <Label htmlFor="pointcloudpath">Nokta Bulutu Yolu</Label>
              <Input
                id="pointcloudpath"
                name="pointcloudpath"
                value={project.pointcloudpath || ""}
                onChange={(e) => setProject(prev => ({ ...prev, pointcloudpath: e.target.value }))}
                placeholder="Nokta bulutu dosya yolu (örn: https://example.com/pointcloud/project.js)"
              />
              <p className="text-xs text-muted-foreground">
                Potree formatında nokta bulutu dosyasının URL'sini girin (cloud.js uzantılı)
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
