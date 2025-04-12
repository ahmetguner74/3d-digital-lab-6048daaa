
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { X, Upload } from "lucide-react";
import { Label } from "@/components/ui/label";

interface AdditionalImagesProps {
  project: any;
  setProject: (project: any) => void;
  setDeletedImageIds: React.Dispatch<React.SetStateAction<string[]>>;
}

export function AdditionalImages({ 
  project, 
  setProject, 
  setDeletedImageIds 
}: AdditionalImagesProps) {
  const additionalImageInputRef = useRef<HTMLInputElement>(null);
  
  const handleAdditionalImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const imageUrl = reader.result as string;
        
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
      };
      
      reader.readAsDataURL(file);
    }
  };
  
  const removeAdditionalImage = (id: number | string) => {
    // Silinecek ID'yi kaydet - string olarak dönüştürüyoruz
    setDeletedImageIds(prev => [...prev, String(id)]);
    
    // UI'dan kaldır
    setProject(prev => ({
      ...prev,
      additionalImages: prev.additionalImages.filter((img: any) => img.id !== id)
    }));
  };
  
  const triggerAdditionalImageUpload = () => {
    if (additionalImageInputRef.current) {
      additionalImageInputRef.current.click();
    }
  };
  
  return (
    <div>
      <Label className="block mb-2">Ek Görseller</Label>
      <div className="border border-dashed border-border rounded-lg p-6 bg-muted/50">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {project.additionalImages && project.additionalImages.map((image: any) => (
            <div 
              key={typeof image.id === 'number' ? `temp-${image.id}` : image.id} 
              className="aspect-square relative bg-background rounded-md border border-border overflow-hidden"
            >
              <img 
                src={image.url} 
                alt={image.alt} 
                className="object-cover w-full h-full"
              />
              <Button 
                variant="destructive" 
                size="icon"
                className="absolute top-1 right-1 h-6 w-6"
                onClick={() => removeAdditionalImage(image.id)}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          ))}
          
          <div 
            className="aspect-square flex flex-col items-center justify-center bg-muted rounded-md border border-dashed border-border cursor-pointer hover:bg-muted/80 transition-colors"
            onClick={triggerAdditionalImageUpload}
          >
            <Upload className="h-6 w-6 text-muted-foreground mb-1" />
            <p className="text-xs text-center text-muted-foreground">Görsel Ekle</p>
          </div>
          
          <input
            ref={additionalImageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleAdditionalImageUpload}
          />
        </div>
      </div>
    </div>
  );
}
