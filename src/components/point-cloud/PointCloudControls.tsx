
import { ZoomIn, ZoomOut, RotateCcw, Maximize, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PointCloudControlsProps {
  isFullscreen: boolean;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onFullscreen: () => void;
}

export default function PointCloudControls({
  isFullscreen,
  onZoomIn,
  onZoomOut,
  onReset,
  onFullscreen
}: PointCloudControlsProps) {
  return (
    <div className="absolute bottom-4 right-4 flex flex-col gap-2 z-10">
      <Button
        variant="secondary"
        size="icon"
        className="bg-background/70 backdrop-blur-sm shadow-sm"
        onClick={onZoomIn}
        title="Yakınlaştır"
      >
        <ZoomIn className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="bg-background/70 backdrop-blur-sm shadow-sm"
        onClick={onZoomOut}
        title="Uzaklaştır"
      >
        <ZoomOut className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="bg-background/70 backdrop-blur-sm shadow-sm"
        onClick={onReset}
        title="Görünümü Sıfırla"
      >
        <RotateCcw className="h-4 w-4" />
      </Button>
      <Button
        variant="secondary"
        size="icon"
        className="bg-background/70 backdrop-blur-sm shadow-sm"
        onClick={onFullscreen}
        title="Tam Ekran"
      >
        {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
      </Button>
    </div>
  );
}
