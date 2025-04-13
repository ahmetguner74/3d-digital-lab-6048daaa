import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowLeft, Download, Share2, ZoomIn, ZoomOut, Maximize, Minimize } from "lucide-react";
import PointCloudViewer from "@/components/point-cloud/PointCloudViewer";
import ThreeViewerControls from "@/components/three/ThreeViewerControls";
import ThreeViewerInfo from "@/components/three/ThreeViewerInfo";
import ThreeViewerAdvantages from "@/components/three/ThreeViewerAdvantages";
import ThreeViewerCta from "@/components/three/ThreeViewerCta";

export default function ThreeDViewer() {
  const [searchParams] = useSearchParams();
  const pointcloudPath = searchParams.get("path");
  const projectTitle = searchParams.get("title") || "3D Görüntüleyici";
  const isEmbedded = searchParams.get("embed") === "true";
  
  const [isLoading, setIsLoading] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewerError, setViewerError] = useState<string | null>(null);

  const handleViewerLoad = () => {
    setIsLoading(false);
  };

  const handleViewerError = (error: string) => {
    setViewerError(error);
    setIsLoading(false);
  };
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);
  
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Tam ekran hatası: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };
  
  if (!pointcloudPath && !isEmbedded) {
    return (
      <Layout>
        <div className="section-container min-h-[80vh] flex flex-col items-center justify-center">
          <h1 className="text-3xl font-bold mb-4">3D Görüntüleyici</h1>
          <p className="text-muted-foreground mb-8 max-w-md text-center">
            Bir nokta bulutu görüntülemek için proje detay sayfasından 3D görüntüleyici butonuna tıklayın.
          </p>
          <Button asChild>
            <Link to="/projects" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Projelere Git
            </Link>
          </Button>
          
          <ThreeViewerInfo className="mt-16" />
          <ThreeViewerAdvantages className="mt-16" />
          <ThreeViewerCta className="mt-16" />
        </div>
      </Layout>
    );
  }
  
  if (isEmbedded) {
    return (
      <>
        <Helmet>
          <title>3D Nokta Bulutu | {projectTitle}</title>
        </Helmet>
        
        <div className="h-full w-full relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
          
          {viewerError && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/95 z-10">
              <div className="text-center p-4">
                <p className="text-red-500 mb-2">{viewerError}</p>
                <Button size="sm" variant="outline" onClick={() => window.location.reload()}>
                  Yeniden Dene
                </Button>
              </div>
            </div>
          )}
          
          <div className="absolute top-2 right-2 flex gap-2 z-20">
            <Button size="sm" variant="outline" onClick={toggleFullscreen} className="bg-background/80">
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </div>
          
          <div className="h-full w-full">
            {pointcloudPath && (
              <PointCloudViewer 
                pointCloudPath={pointcloudPath}
                height="100%"
              />
            )}
          </div>
        </div>
      </>
    );
  }
  
  return (
    <Layout>
      <Helmet>
        <title>3D Nokta Bulutu | {projectTitle}</title>
        <meta name="description" content={`${projectTitle} projesinin 3D nokta bulutu görüntüleyicisi - 3D Dijital Lab`} />
      </Helmet>
      
      <div className="py-4 px-4 md:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
          <div>
            <Link to="/projects" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 mb-2">
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Projelere Dön</span>
            </Link>
            <h1 className="text-2xl font-bold">{projectTitle}</h1>
            <p className="text-muted-foreground">3D Nokta Bulutu Görüntüleyici</p>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-1.5 h-4 w-4" />
              <span>İndir</span>
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-1.5 h-4 w-4" />
              <span>Paylaş</span>
            </Button>
            <Button variant="default" size="sm" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize className="mr-1.5 h-4 w-4" /> : <Maximize className="mr-1.5 h-4 w-4" />}
              <span>{isFullscreen ? "Tam Ekrandan Çık" : "Tam Ekran"}</span>
            </Button>
          </div>
        </div>
        
        <div className="relative h-[70vh] rounded-lg overflow-hidden border border-muted">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
              <div className="text-center">
                <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
                <p>Nokta bulutu yükleniyor...</p>
              </div>
            </div>
          )}
          
          {viewerError && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/95 z-10">
              <div className="text-center max-w-md p-6">
                <p className="text-red-500 mb-4">{viewerError}</p>
                <p className="mb-4 text-muted-foreground">Nokta bulutu yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.</p>
                <Button onClick={() => window.location.reload()}>
                  Yeniden Dene
                </Button>
              </div>
            </div>
          )}
          
          <div className="h-full w-full">
            {pointcloudPath && (
              <PointCloudViewer 
                pointCloudPath={pointcloudPath}
                height="100%"
              />
            )}
          </div>
        </div>
        
        <ThreeViewerControls className="mt-4" />
      </div>
      
      <div className="section-container py-12">
        <ThreeViewerInfo />
        <ThreeViewerAdvantages className="mt-16" />
        <ThreeViewerCta className="mt-16" />
      </div>
    </Layout>
  );
}
