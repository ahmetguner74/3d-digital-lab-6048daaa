
import { useRef, useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Loader2, Upload, Check, AlertTriangle, X, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
  DialogTrigger,
} from "@/components/ui/dialog";

interface PointCloudTabProps {
  project: any;
  setProject: (project: any) => void;
}

export default function PointCloudTab({ project, setProject }: PointCloudTabProps) {
  const [uploadingPointCloud, setUploadingPointCloud] = useState(false);
  const [pointCloudError, setPointCloudError] = useState<string | null>(null);
  const [previewAvailable, setPreviewAvailable] = useState(false);
  const pointCloudFileInputRef = useRef<HTMLInputElement>(null);
  const previewIframeRef = useRef<HTMLIFrameElement>(null);
  const { toast } = useToast();
  
  // Nokta bulutu dosyası var olduğunda önizleme durumunu kontrol et
  useEffect(() => {
    setPreviewAvailable(Boolean(project?.pointcloudpath && project?.haspointcloud));
  }, [project?.pointcloudpath, project?.haspointcloud]);

  const handlePointCloudUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const file = e.target.files[0];
    setUploadingPointCloud(true);
    setPointCloudError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const simulatedUrl = `https://storage.example.com/pointclouds/${file.name}`;
      setProject(prev => ({
        ...prev,
        pointcloudpath: simulatedUrl,
        haspointcloud: true
      }));
      toast({
        title: "Dosya Yüklendi",
        description: "Nokta bulutu dosyası başarıyla yüklendi.",
      });
      setPreviewAvailable(true);
    } catch (error: any) {
      console.error("Nokta bulutu yüklenirken hata:", error);
      setPointCloudError(error.message || "Nokta bulutu yüklenirken bir hata oluştu");
      toast({
        title: "Hata",
        description: `Nokta bulutu yüklenirken bir sorun oluştu: ${error.message}`,
        variant: "destructive"
      });
    } finally {
      setUploadingPointCloud(false);
    }
  };
  
  const triggerPointCloudUpload = () => {
    if (pointCloudFileInputRef.current) {
      pointCloudFileInputRef.current.click();
    }
  };
  
  const removePointCloud = () => {
    setProject(prev => ({
      ...prev,
      pointcloudpath: "",
      haspointcloud: false
    }));
    
    setPreviewAvailable(false);
    
    toast({
      title: "Nokta Bulutu Kaldırıldı",
      description: "Nokta bulutu dosyası başarıyla kaldırıldı.",
    });
  };
  
  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setProject(prev => ({
      ...prev,
      pointcloudpath: url
    }));
    
    // URL girildiğinde önizleme durumunu güncelle
    setPreviewAvailable(Boolean(url && project?.haspointcloud));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Nokta Bulutu Yönetimi</CardTitle>
        <CardDescription>
          3D nokta bulutu dosyalarınızı bu alandan yükleyebilir ve yönetebilirsiniz.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Switch 
              id="haspointcloud" 
              checked={project.haspointcloud}
              onCheckedChange={(checked) => {
                setProject(prev => ({ ...prev, haspointcloud: checked }));
                setPreviewAvailable(checked && Boolean(project.pointcloudpath));
              }}
            />
            <Label htmlFor="haspointcloud">Bu proje nokta bulutu görüntüleyici içerir</Label>
          </div>
          <p className="text-sm text-muted-foreground">
            Nokta bulutu görüntüleyici etkinleştirildiğinde, proje detay sayfasında interaktif 3D nokta bulutu görüntüleyicisi gösterilir.
          </p>
        </div>
        
        {project.haspointcloud && (
          <div className="space-y-4">
            <div className="border border-dashed border-border rounded-lg p-6 bg-muted/50">
              {project.pointcloudpath ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Yüklenen Nokta Bulutu</h4>
                      <p className="text-sm text-muted-foreground break-all mt-1">
                        {project.pointcloudpath}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      {previewAvailable && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" /> Önizle
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl h-[80vh]">
                            <DialogHeader>
                              <DialogTitle>Nokta Bulutu Önizleme</DialogTitle>
                            </DialogHeader>
                            <div className="w-full h-full min-h-[60vh] bg-muted rounded-md border border-border p-2">
                              <iframe
                                ref={previewIframeRef}
                                src={`/projects/preview?pointcloud=${encodeURIComponent(project.pointcloudpath)}`}
                                className="w-full h-full rounded"
                                title="Nokta Bulutu Önizleme"
                              />
                            </div>
                          </DialogContent>
                        </Dialog>
                      )}
                      
                      <Button 
                        variant="destructive" 
                        size="sm" 
                        onClick={removePointCloud}
                      >
                        <X className="h-4 w-4 mr-1" /> Kaldır
                      </Button>
                    </div>
                  </div>
                  
                  <div className="bg-primary/5 p-4 rounded-md border border-primary/20">
                    <h4 className="font-medium text-sm flex items-center">
                      <Check className="h-4 w-4 text-primary mr-1" />
                      Dosya Yüklendi
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Bu dosya proje kaydedildiğinde kullanılacaktır.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-6">
                  <div className="bg-primary/5 rounded-full p-4 mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <h4 className="font-medium mb-2">Nokta Bulutu Yükleme</h4>
                  <p className="text-sm text-muted-foreground text-center max-w-md mb-4">
                    Potree formatında nokta bulutu dosyasını (.js uzantılı cloud.js dosyası) yükleyin veya doğrudan URL'sini aşağıdaki alana girin.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
                    <Button 
                      onClick={triggerPointCloudUpload}
                      disabled={uploadingPointCloud}
                      className="flex-1"
                    >
                      {uploadingPointCloud ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Yükleniyor...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Dosya Seç
                        </>
                      )}
                    </Button>
                    
                    <div className="text-center text-muted-foreground py-2">veya</div>
                    
                    <Input
                      placeholder="Nokta bulutu URL'si"
                      value={project.pointcloudpath || ""}
                      onChange={handleUrlChange}
                      className="flex-1"
                    />
                  </div>
                  
                  <input
                    ref={pointCloudFileInputRef}
                    type="file"
                    accept=".js"
                    className="hidden"
                    onChange={handlePointCloudUpload}
                  />
                  
                  {pointCloudError && (
                    <div className="mt-4 text-destructive text-sm flex items-center">
                      <AlertTriangle className="h-4 w-4 mr-1" />
                      {pointCloudError}
                    </div>
                  )}
                </div>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="pointcloudpath">Nokta Bulutu URL</Label>
              <Input
                id="pointcloudpath"
                placeholder="https://example.com/pointclouds/project/cloud.js"
                value={project.pointcloudpath || ""}
                onChange={handleUrlChange}
              />
              <p className="text-xs text-muted-foreground">
                Potree formatında nokta bulutu dosyasının URL'sini girin. Dosya cloud.js ile bitmelidir.
              </p>
            </div>
            
            <div className="bg-muted/50 p-4 rounded-md border border-border">
              <h4 className="font-medium mb-2 flex items-center">
                <AlertTriangle className="h-4 w-4 mr-1 text-yellow-500" />
                Önemli Bilgi
              </h4>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>
                  Nokta bulutu dosyaları büyük olabilir ve özel bir sunucu yapılandırması gerektirebilir. 
                  Aşağıdaki hususları dikkate alın:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Potree formatında bir nokta bulutu dosyası kullanın</li>
                  <li>Ana dosya cloud.js olmalı ve tüm ilgili veri dosyalarına erişilebilmelidir</li>
                  <li>Dosyalar CORS erişimine izin veren bir sunucuda barındırılmalıdır</li>
                  <li>Büyük dosyalar için CDN kullanımı önerilir</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
