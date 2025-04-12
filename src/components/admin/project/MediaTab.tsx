
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
import { ImageUploadArea } from "./ImageUploadArea";
import { AdditionalImages } from "./AdditionalImages";

interface MediaTabProps {
  project: any;
  setProject: (project: any) => void;
  previewImages: {[key: string]: string};
  setPreviewImages: (images: {[key: string]: string}) => void;
  setDeletedImageIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function MediaTab({ 
  project, 
  setProject, 
  previewImages, 
  setPreviewImages,
  setDeletedImageIds
}: MediaTabProps) {
  const mainImageInputRef = useRef<HTMLInputElement>(null);
  const beforeImageInputRef = useRef<HTMLInputElement>(null);
  const afterImageInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (type: string, e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        // Doğrudan state değişkenini güncelle, callback kullanma
        const newPreviewImages = { ...previewImages, [type]: imageUrl };
        setPreviewImages(newPreviewImages);
        
        if (type === "main") {
          setProject(prev => ({
            ...prev,
            cover_image: imageUrl
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
  
  const removeImage = (type: string, id?: number | string) => {
    if (type === "additional" && id) {
      // Silinecek ID'yi kaydet - string olarak dönüştürüyoruz
      setDeletedImageIds(prev => [...prev, String(id)]);
      
      // UI'dan kaldır
      setProject(prev => ({
        ...prev,
        additionalImages: prev.additionalImages.filter((img: any) => img.id !== id)
      }));
    } else if (type === "main") {
      setProject(prev => ({
        ...prev,
        cover_image: ""
      }));
      
      // Önizleme görselini kaldır
      const updatedPreviews = { ...previewImages };
      delete updatedPreviews[type];
      setPreviewImages(updatedPreviews);
    } else {
      setProject(prev => ({
        ...prev,
        images: prev.images.filter((img: any) => img.type !== type)
      }));
      
      // Önizleme görselini kaldır
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
          <ImageUploadArea
            label="Ana Görsel"
            imageUrl={getImageUrl('main')}
            onRemove={() => removeImage('main')}
            onTriggerUpload={() => triggerImageUpload(mainImageInputRef)}
            inputRef={mainImageInputRef}
            onChange={(e) => handleImageUpload('main', e)}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ImageUploadArea
              label="Öncesi Görseli"
              imageUrl={getImageUrl('before')}
              onRemove={() => removeImage('before')}
              onTriggerUpload={() => triggerImageUpload(beforeImageInputRef)}
              inputRef={beforeImageInputRef}
              onChange={(e) => handleImageUpload('before', e)}
              imageHeight="max-h-36"
            />
            
            <ImageUploadArea
              label="Sonrası Görseli"
              imageUrl={getImageUrl('after')}
              onRemove={() => removeImage('after')}
              onTriggerUpload={() => triggerImageUpload(afterImageInputRef)}
              inputRef={afterImageInputRef}
              onChange={(e) => handleImageUpload('after', e)}
              imageHeight="max-h-36"
            />
          </div>
          
          <AdditionalImages 
            project={project} 
            setProject={setProject} 
            setDeletedImageIds={setDeletedImageIds} 
          />
        </div>
      </CardContent>
    </Card>
  );
}
