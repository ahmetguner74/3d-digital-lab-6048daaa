
import PointCloudViewer from "@/components/PointCloudViewer";

interface ProjectPointCloudProps {
  pointCloudPath: string;
}

export default function ProjectPointCloud({ pointCloudPath }: ProjectPointCloudProps) {
  return (
    <section className="min-h-screen bg-background flex items-center">
      <div className="section-container py-20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 reveal">Nokta Bulutu Görüntüleyici</h2>
        
        <div className="w-full h-[500px] rounded-lg overflow-hidden reveal border border-border">
          <PointCloudViewer pointCloudPath={pointCloudPath} />
        </div>
        
        <p className="text-lg text-center mt-8 max-w-3xl mx-auto text-muted-foreground reveal">
          Bu interaktif nokta bulutu modeli, lazer tarama teknolojisi ile elde edilmiş milyonlarca 
          veri noktasını içermektedir. Görüntüyü yakınlaştırıp uzaklaştırabilir, farklı açılardan 
          inceleyebilirsiniz.
        </p>
      </div>
    </section>
  );
}
