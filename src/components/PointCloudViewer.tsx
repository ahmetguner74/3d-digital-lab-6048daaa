
import { useEffect, useRef } from "react";

interface PointCloudViewerProps {
  pointCloudPath: string;
}

export default function PointCloudViewer({ pointCloudPath }: PointCloudViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewerInitialized = useRef<boolean>(false);

  useEffect(() => {
    // Check if container exists
    if (!containerRef.current) return;
    
    console.log("PointCloudViewer yükleniyor, path:", pointCloudPath);
    
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
        initPotreeViewer();
      } catch (error) {
        console.error('Potree yüklenirken hata:', error);
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
      if (!containerRef.current || viewerInitialized.current || typeof (window as any).Potree === 'undefined') return;

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
        });

        // Mark as initialized
        viewerInitialized.current = true;
        console.log("Potree görüntüleyici başlatıldı");
        
      } catch (error) {
        console.error('Potree görüntüleyici başlatılırken hata:', error);
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

  return (
    <div className="potree-container w-full" style={{ height: "500px" }}>
      <div ref={containerRef} className="w-full h-full"></div>
      <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 p-1 rounded">
        Potree v1.8 | Nokta bulutu: {pointCloudPath.split('/').pop()}
      </div>
    </div>
  );
}
