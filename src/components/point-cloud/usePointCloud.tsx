import { useState, useRef, useEffect } from "react";

interface UsePointCloudProps {
  pointCloudPath: string;
  containerRef: React.RefObject<HTMLDivElement>;
}

interface UsePointCloudReturn {
  loading: boolean;
  error: string | null;
  viewerInstance: any;
  isFullscreen: boolean;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleReset: () => void;
  handleFullscreen: () => void;
}

export default function usePointCloud({ pointCloudPath, containerRef }: UsePointCloudProps): UsePointCloudReturn {
  const viewerInitialized = useRef<boolean>(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewerInstance, setViewerInstance] = useState<any>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Tam ekran durumunu izleyelim
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  useEffect(() => {
    // Check if container exists
    if (!containerRef.current) return;
    
    console.log("PointCloudViewer yükleniyor, path:", pointCloudPath);
    setLoading(true);
    
    // Load Potree scripts dynamically
    const loadPotreeScripts = async () => {
      try {
        if (!document.getElementById('potree-script')) {
          console.log("Potree scriptleri yükleniyor...");
          
          // Potree stylesheets
          const potreeStyle = document.createElement('link');
          potreeStyle.rel = 'stylesheet';
          potreeStyle.href = 'https://cdn.jsdelivr.net/gh/potree/potree@1.8/build/potree/potree.css';
          document.head.appendChild(potreeStyle);
          
          const materialIconsStyle = document.createElement('link');
          materialIconsStyle.rel = 'stylesheet';
          materialIconsStyle.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
          document.head.appendChild(materialIconsStyle);
          
          // ThreeJS Script
          await loadScript('https://cdn.jsdelivr.net/gh/potree/potree@1.8/libs/three.js/build/three.min.js');
          
          // Other dependencies
          await loadScript('https://cdn.jsdelivr.net/gh/potree/potree@1.8/libs/other/BinaryHeap.js');
          await loadScript('https://cdn.jsdelivr.net/gh/potree/potree@1.8/libs/other/OrbitControls.js');
          await loadScript('https://cdn.jsdelivr.net/gh/potree/potree@1.8/libs/other/stats.min.js');
          await loadScript('https://cdn.jsdelivr.net/gh/potree/potree@1.8/libs/other/dat.gui.min.js');
          
          // Potree main script
          await loadScript('https://cdn.jsdelivr.net/gh/potree/potree@1.8/build/potree/potree.js', 'potree-script');
          
          console.log("Potree scriptleri yüklendi");
        }
        
        // Initialize Potree viewer once scripts are loaded
        setTimeout(() => {
          initPotreeViewer();
        }, 500); // İlk scriptler yüklendikten sonra kısa bir bekleme ekledim
      } catch (error) {
        console.error('Potree yüklenirken hata:', error);
        setError('Potree scriptleri yüklenirken bir hata oluştu.');
        setLoading(false);
      }
    };
    
    // Helper function to load scripts
    const loadScript = (src: string, id?: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        if (id) script.id = id;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Script yüklenirken hata: ${src}`));
        document.body.appendChild(script);
      });
    };

    // Initialize Potree viewer
    const initPotreeViewer = () => {
      if (!containerRef.current || viewerInitialized.current || typeof (window as any).Potree === 'undefined') {
        if (!containerRef.current) console.error("Container bulunamadı");
        if (viewerInitialized.current) console.warn("Viewer zaten başlatılmış");
        if (typeof (window as any).Potree === 'undefined') console.error("Potree objesi bulunamadı");
        return;
      }

      try {
        console.log("Potree görüntüleyici başlatılıyor");
        
        const Potree = (window as any).Potree;
        const THREE = (window as any).THREE;
        
        // Create viewer
        const viewer = new Potree.Viewer(containerRef.current);
        viewer.setEDLEnabled(true);
        viewer.setFOV(60);
        viewer.setPointBudget(1_000_000);
        viewer.setBackground("gradient"); // skybox, gradient, black, white
        viewer.loadSettingsFromURL();
        
        // Save viewer instance for controls
        setViewerInstance(viewer);
        
        // Load point cloud
        console.log("Nokta bulutu yükleniyor:", pointCloudPath);
        Potree.loadPointCloud(pointCloudPath, "point_cloud", (e: any) => {
          console.log("Nokta bulutu yüklendi");
          viewer.scene.addPointCloud(e.pointcloud);
          
          // Set camera position
          const camera = viewer.scene.getActiveCamera();
          camera.position.set(0, 0, 10);
          camera.lookAt(new THREE.Vector3(0, 0, 0));
          
          // Add measurement tools
          viewer.setNavigationMode(Potree.EarthControls);
          
          // GUI elements
          const measuringTool = new Potree.MeasuringTool(viewer);
          const profileTool = new Potree.ProfileTool(viewer);
          const volumeTool = new Potree.VolumeTool(viewer);

          // Add controls panel
          viewer.loadGUI(() => {
            viewer.setLanguage('tr');
            viewer.toggleSidebar();
          });
          
          // Fit view to point cloud
          viewer.fitToScreen();
          
          // Mark as initialized and loading complete
          viewerInitialized.current = true;
          setLoading(false);
          console.log("Potree görüntüleyici başlatıldı");
        });

      } catch (error) {
        console.error('Potree görüntüleyici başlatılırken hata:', error);
        setError('Potree görüntüleyici başlatılamadı. Lütfen daha sonra tekrar deneyin.');
        setLoading(false);
      }
    };

    loadPotreeScripts();
    
    // Cleanup function
    return () => {
      // Potree doesn't have a built-in cleanup method
      // We'll just mark our component as not initialized for potential re-mounting
      viewerInitialized.current = false;
    };
  }, [pointCloudPath]);

  // Viewer control functions
  const handleZoomIn = () => {
    if (viewerInstance) {
      const camera = viewerInstance.scene.getActiveCamera();
      camera.position.z *= 0.8;
    }
  };

  const handleZoomOut = () => {
    if (viewerInstance) {
      const camera = viewerInstance.scene.getActiveCamera();
      camera.position.z *= 1.2;
    }
  };

  const handleReset = () => {
    if (viewerInstance) {
      viewerInstance.fitToScreen();
    }
  };

  const handleFullscreen = () => {
    if (containerRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        containerRef.current.requestFullscreen();
      }
    }
  };

  return {
    loading,
    error,
    viewerInstance,
    isFullscreen,
    handleZoomIn,
    handleZoomOut,
    handleReset,
    handleFullscreen
  };
}
