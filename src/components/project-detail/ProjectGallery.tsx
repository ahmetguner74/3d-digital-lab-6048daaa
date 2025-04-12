
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string;
  sequence_order: number;
}

interface ProjectGalleryProps {
  projectImages: ProjectImage[];
  projectTitle: string;
}

export default function ProjectGallery({ projectImages, projectTitle }: ProjectGalleryProps) {
  return (
    <section className="min-h-screen bg-background flex items-center">
      <div className="section-container py-20">
        <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center reveal">Proje Galerisi</h2>
        
        <Carousel className="w-full max-w-5xl mx-auto reveal">
          <CarouselContent>
            {projectImages.map(image => (
              <CarouselItem key={image.id}>
                <div className="p-1">
                  <div className="aspect-video overflow-hidden rounded-lg">
                    <img 
                      src={image.image_url} 
                      alt={image.alt_text || `${projectTitle} görsel`} 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="left-1" />
          <CarouselNext className="right-1" />
        </Carousel>
      </div>
    </section>
  );
}
