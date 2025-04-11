import { useRef } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { X, Upload, ImagePlus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface MediaTabProps {
  project: any;
  setProject: (project: any) => void;
  previewImages: {[key: string]: string};
  setPreviewImages: (images: {[key: string]: string}) => void;
}

export default function MediaTab({ 
  project, 
  setProject, 
  previewImages, 
  setPreviewImages 
}: MediaTabProps) {
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const beforeImageInputRef = useRef<HTMLInputElement>(null);
  const afterImageInputRef = useRef<HTMLInputElement>(null);
  const additionalImageInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        setPreviewImages({
          ...previewImages,
          [type]: imageUrl
        });
        
        if (type === "main") {
          setProject(prev => ({
            ...prev,
            cover_image: imageUrl
          }));
        } else if (type === "additional") {
          const newImage = {
            id: Date.now(),
            url: imageUrl,
            alt: "Ek görsel",
            type: "additional"
          };
          
          setProject(prev => ({
            ...prev,
            additionalImages: [...(prev.additionalImages || []), newImage]
          }));
        } else {
          const imageIndex = project.images.findIndex((img: any) => img.type === type);
          
          if (imageIndex >= 0) {
            setProject(prev => {
              const updatedImages = [...prev.images];
              updatedImages[imageIndex] = {
                ...updatedImages[imageIndex],
                url: imageUrl
              };
              return { ...prev, images: updatedImages };
            });
          } else {
            setProject(prev => ({
              ...prev,
              images: [
                ...prev.images,
                {
                  id: Date.now(),
                  url: imageUrl,
                  alt: `${type} görsel`,
                  type
                }
              ]
            }));
          }
        }
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const removeImage = (type: string, id?: number) => {
    if (type === "additional" && id) {
      setProject(prev => ({
        ...prev,
        additionalImages: prev.additionalImages.filter((img: any) => img.id !== id)
      }));
    } else if (type === "main") {
      setProject(prev => ({
        ...prev,
        cover_image: ""
      }));
      
      const updatedPreviews = { ...previewImages };
      delete updatedPreviews[type];
      setPreviewImages(updatedPreviews);
    } else {
      setProject(prev => ({
        ...prev,
        images: prev.images.filter((img: any) => img.type !== type)
      }));
      
      const updatedPreviews = { ...previewImages };
      delete updatedPreviews[type];
      setPreviewImages(updatedPreviews);
    }
  };
  
  const getImageUrl = (type: string) => {
    if (previewImages[type]) {
      return previewImages[type];
    }
    
    if (type === "main" && project.cover_image) {
      return project.cover_image;
    }
    
    const image = project.images.find((img: any) => img.type === type);
    if (image) {
      return image.url;
    }
    
    return null;
  };
  
  const triggerImageUpload = (ref: React.RefObject<HTMLInputElement>) => {
    if (ref.current) {
      ref.current.click();
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medya Dosyaları</CardTitle>
        <CardDescription>
          Projeye ait görselleri ve dosyaları buradan yönetebilirsiniz.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div>
            <Label className="block mb-2">Ana Görsel</Label>
            <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-muted/50">
              {getImageUrl('main') ? (
                <div className="relative w-full">
                  <img 
                    src={getImageUrl('main')} 
                    alt="Ana görsel"
                    className="w-full h-auto max-h-48 object-contain mx-auto"
                  />
                  <Button 
                    variant="destructive" 
                    size="icon"
                    className="absolute top-0 right-0"
                    onClick={() => removeImage('main')}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  
                  <div className="absolute bottom-2 right-2">
                    <Button 
                      variant="secondary"
                      size="sm"
                      onClick={() => triggerImageUpload(mainImageInputRef)}
                      className="flex items-center"
                    >
                      <ImagePlus className="h-4 w-4 mr-1" />
                      Değiştir
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Ana görseli yüklemek için tıklayın veya sürükleyin
                  </p>
                  <Button 
                    variant="secondary" 
                    size="sm" 
                    className="mt-4"
                    onClick={() => triggerImageUpload(mainImageInputRef)}
                  >
                    Dosya Seç
                  </Button>
                </div>
              )}
              
              <input
                ref={mainImageInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleImageUpload('main', e)}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label className="block mb-2">Öncesi Görseli</Label>
              <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-muted/50">
                {getImageUrl('before') ? (
                  <div className="relative w-full">
                    <img 
                      src={getImageUrl('before')} 
                      alt="Öncesi görseli"
                      className="w-full h-auto max-h-36 object-contain mx-auto"
                    />
                    <Button 
                      variant="destructive" 
                      size="icon"
                      className="absolute top-0 right-0"
                      onClick={() => removeImage('before')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    
                    <div className="absolute bottom-2 right-2">
                      <Button 
                        variant="secondary"
                        size="sm"
                        onClick={() => triggerImageUpload(beforeImageInputRef)}
                        className="flex items-center"
                      >
                        <ImagePlus className="h-4 w-4 mr-1" />
                        Değiştir
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      "Öncesi" görseli
                    </p>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => triggerImageUpload(beforeImageInputRef)}
                    >
                      Yükle
                    </Button>
                  </div>
                )}
                
                <input
                  ref={beforeImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload('before', e)}
                />
              </div>
            </div>
            
            <div>
              <Label className="block mb-2">Sonrası Görseli</Label>
              <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-muted/50">
                {getImageUrl('after') ? (
                  <div className="relative w-full">
                    <img 
                      src={getImageUrl('after')} 
                      alt="Sonrası görseli"
                      className="w-full h-auto max-h-36 object-contain mx-auto"
                    />
                    <Button 
                      variant="destructive" 
                      size="icon"
                      className="absolute top-0 right-0"
                      onClick={() => removeImage('after')}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    
                    <div className="absolute bottom-2 right-2">
                      <Button 
                        variant="secondary"
                        size="sm"
                        onClick={() => triggerImageUpload(afterImageInputRef)}
                        className="flex items-center"
                      >
                        <ImagePlus className="h-4 w-4 mr-1" />
                        Değiştir
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">
                      "Sonrası" görseli
                    </p>
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      className="mt-2"
                      onClick={() => triggerImageUpload(afterImageInputRef)}
                    >
                      Yükle
                    </Button>
                  </div>
                )}
                
                <input
                  ref={afterImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload('after', e)}
                />
              </div>
            </div>
          </div>
          
          <div>
            <Label className="block mb-2">Ek Görseller</Label>
            <div className="border border-dashed border-border rounded-lg p-6 bg-muted/50">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {project.additionalImages && project.additionalImages.map((image: any) => (
                  <div key={typeof image.id === 'number' ? `temp-${image.id}` : image.id} className="aspect-square relative bg-background rounded-md border border-border overflow-hidden">
                    <img 
                      src={image.url} 
                      alt={image.alt} 
                      className="object-cover w-full h-full"
                    />
                    <Button 
                      variant="destructive" 
                      size="icon"
                      className="absolute top-1 right-1 h-6 w-6"
                      onClick={() => removeImage('additional', image.id)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                <div 
                  className="aspect-square flex flex-col items-center justify-center bg-muted rounded-md border border-dashed border-border cursor-pointer hover:bg-muted/80 transition-colors"
                  onClick={() => triggerImageUpload(additionalImageInputRef)}
                >
                  <Upload className="h-6 w-6 text-muted-foreground mb-1" />
                  <p className="text-xs text-center text-muted-foreground">Görsel Ekle</p>
                </div>
                
                <input
                  ref={additionalImageInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleImageUpload('additional', e)}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
