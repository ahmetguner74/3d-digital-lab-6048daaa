
import { Button } from "@/components/ui/button";
import { X, Upload, ImagePlus } from "lucide-react";
import { Label } from "@/components/ui/label";

interface ImageUploadAreaProps {
  label: string;
  imageUrl: string | null;
  onRemove: () => void;
  onTriggerUpload: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  imageHeight?: string;
}

export function ImageUploadArea({
  label,
  imageUrl,
  onRemove,
  onTriggerUpload,
  inputRef,
  onChange,
  imageHeight = "max-h-48"
}: ImageUploadAreaProps) {
  return (
    <div>
      <Label className="block mb-2">{label}</Label>
      <div className="border border-dashed border-border rounded-lg p-6 flex flex-col items-center justify-center bg-muted/50">
        {imageUrl ? (
          <div className="relative w-full">
            <img 
              src={imageUrl} 
              alt={label}
              className={`w-full h-auto ${imageHeight} object-contain mx-auto`}
            />
            <Button 
              variant="destructive" 
              size="icon"
              className="absolute top-0 right-0"
              onClick={onRemove}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <div className="absolute bottom-2 right-2">
              <Button 
                variant="secondary"
                size="sm"
                onClick={onTriggerUpload}
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
              {label} yüklemek için tıklayın
            </p>
            <Button 
              variant="secondary" 
              size="sm" 
              className="mt-2"
              onClick={onTriggerUpload}
            >
              Yükle
            </Button>
          </div>
        )}
        
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
      </div>
    </div>
  );
}
