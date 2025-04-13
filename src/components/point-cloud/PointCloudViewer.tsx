
import { useRef } from "react";
import PointCloudControls from "./PointCloudControls";
import PointCloudStatus from "./PointCloudStatus";
import PointCloudInfo from "./PointCloudInfo";
import usePointCloud from "./usePointCloud";

interface PointCloudViewerProps {
  pointCloudPath: string;
  className?: string;
  height?: string;
}

export default function PointCloudViewer({ 
  pointCloudPath, 
  className = "",
  height = "500px" 
}: PointCloudViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const {
    loading,
    error,
    isFullscreen,
    handleZoomIn,
    handleZoomOut,
    handleReset,
    handleFullscreen
  } = usePointCloud({
    pointCloudPath,
    containerRef
  });

  return (
    <div className={`potree-container w-full relative ${className}`} style={{ height }}>
      <div ref={containerRef} className="w-full h-full"></div>
      
      {/* Yükleniyor ve hata durumları */}
      <PointCloudStatus loading={loading} error={error} />
      
      {/* Görüntüleyici kontrolleri ve bilgiler */}
      {!loading && !error && (
        <>
          <PointCloudControls
            isFullscreen={isFullscreen}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onReset={handleReset}
            onFullscreen={handleFullscreen}
          />
          
          <PointCloudInfo pointCloudPath={pointCloudPath} />
        </>
      )}
    </div>
  );
}
