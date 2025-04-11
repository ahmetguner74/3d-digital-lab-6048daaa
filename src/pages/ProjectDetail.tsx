
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";

// Sample project data - This will be fetched from Supabase in a later step
const sampleProjects = [
  {
    id: 1,
    slug: "sivil-mimari",
    title: "Sivil Mimari Örneği",
    description: "Modern ve tarihi yapıların detaylı 3D tarama ve modellemesi",
    beforeImage: "/placeholder.svg",
    afterImage: "/placeholder.svg", 
    hasPointCloud: true,
    content: "Bu projede sivil mimari yapısının hem dış hem de iç kısımlarının lazer tarama teknolojisi kullanılarak milimetrik hassasiyetle 3D modelleri oluşturulmuştur. Tarama sonuçları, yapının mevcut durumunu detaylı şekilde belgelemekte ve olası restorasyon çalışmalarına temel oluşturmaktadır.",
    additionalImages: ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]
  },
  {
    id: 2,
    slug: "arkeolojik-eserler",
    title: "Arkeolojik Eserler",
    description: "Tarihi eserlerin detaylı 3D modellenmesi",
    beforeImage: "/placeholder.svg",
    afterImage: "/placeholder.svg",
    hasPointCloud: false,
    content: "Arkeolojik eserlerin korunması için yürüttüğümüz bu projede, yüksek hassasiyetli tarama teknolojileri kullanılarak çeşitli arkeolojik buluntuların 3D modelleri oluşturulmuştur. Bu modeller sayesinde eserler hem daha detaylı incelenebilmekte hem de dijital ortamda korunarak gelecek nesillere aktarılabilmektedir.",
    additionalImages: ["/placeholder.svg", "/placeholder.svg"]
  }
];

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [sliderValue, setSliderValue] = useState(50);
  const [loaded, setLoaded] = useState(false);
  
  // Find the project based on the slug
  useEffect(() => {
    const currentProject = sampleProjects.find(p => p.slug === slug);
    
    if (currentProject) {
      setProject(currentProject);
      
      // Reset the slider when changing projects
      setSliderValue(50);
      setLoaded(true);
    }
  }, [slug]);
  
  // Find previous and next projects for navigation
  const currentIndex = sampleProjects.findIndex(p => p.slug === slug);
  const prevProject = currentIndex > 0 ? sampleProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < sampleProjects.length - 1 ? sampleProjects[currentIndex + 1] : null;

  if (!loaded) {
    return (
      <Layout>
        <div className="section-container min-h-screen flex items-center justify-center">
          <p>Yükleniyor...</p>
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="section-container min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Proje Bulunamadı</h1>
            <Button asChild>
              <Link to="/projects">Tüm Projelere Dön</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Helmet>
        <title>{project.title} | 3D Mimari Dijitalleştirme Atölyesi</title>
        <meta name="description" content={project.description} />
      </Helmet>
      
      {/* Section 1: Before-After Slider */}
      <section className="min-h-screen bg-muted/50 dark:bg-muted/20 flex items-center">
        <div className="section-container py-20">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 reveal">{project.title}</h1>
          
          <div className="relative aspect-video w-full max-w-5xl mx-auto border border-border rounded-lg overflow-hidden reveal">
            <div className="relative w-full h-full">
              {/* After image (background) */}
              <img 
                src={project.afterImage} 
                alt="After"
                className="absolute w-full h-full object-cover"
              />
              
              {/* Before image (foreground with clip) */}
              <div 
                className="absolute top-0 left-0 h-full overflow-hidden"
                style={{ width: `${sliderValue}%` }}
              >
                <img 
                  src={project.beforeImage} 
                  alt="Before"
                  className="w-[100vw] h-full object-cover"
                />
                
                {/* Slider handle */}
                <div 
                  className="absolute top-0 bottom-0 right-0 w-1 bg-primary cursor-ew-resize"
                >
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-4 border-primary bg-white flex items-center justify-center">
                    <div className="flex gap-0.5">
                      <ArrowLeft className="h-3 w-3 text-primary" />
                      <ArrowRight className="h-3 w-3 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Labels */}
              <div className="absolute top-4 left-4 px-2 py-1 bg-black/50 text-white text-sm rounded">
                Öncesi
              </div>
              <div className="absolute top-4 right-4 px-2 py-1 bg-black/50 text-white text-sm rounded">
                Sonrası
              </div>
            </div>
            
            {/* Slider control */}
            <div className="mt-4 px-4">
              <Slider
                value={[sliderValue]}
                onValueChange={(value) => setSliderValue(value[0])}
                max={100}
                step={1}
                className="w-full"
              />
            </div>
          </div>
          
          <p className="text-lg text-center mt-8 max-w-3xl mx-auto text-muted-foreground reveal">
            Kaydırıcıyı hareket ettirerek öncesi ve sonrası arasındaki farkı görebilirsiniz.
          </p>
        </div>
      </section>
      
      {/* Section 2: Point Cloud Viewer (if applicable) */}
      {project.hasPointCloud && (
        <section className="min-h-screen bg-background flex items-center">
          <div className="section-container py-20">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 reveal">Nokta Bulutu Görüntüleyici</h2>
            
            <div className="aspect-[16/9] w-full bg-muted rounded-lg overflow-hidden reveal">
              {/* This div will be replaced with potree viewer */}
              <div className="w-full h-full flex items-center justify-center bg-black/10">
                <p className="text-lg text-muted-foreground">
                  Potree nokta bulutu görüntüleyici buraya eklenecek
                </p>
              </div>
            </div>
            
            <p className="text-lg text-center mt-8 max-w-3xl mx-auto text-muted-foreground reveal">
              Bu interaktif nokta bulutu modeli, lazer tarama teknolojisi ile elde edilmiş milyonlarca 
              veri noktasını içermektedir. Görüntüyü yakınlaştırıp uzaklaştırabilir, farklı açılardan 
              inceleyebilirsiniz.
            </p>
          </div>
        </section>
      )}
      
      {/* Section 3: Project Details */}
      <section className="min-h-screen bg-muted/50 dark:bg-muted/20 flex items-center">
        <div className="section-container py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 reveal">
              <h2 className="text-2xl sm:text-3xl font-bold">Proje Detayları</h2>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p>{project.content}</p>
                <p>
                  3D modelleme teknolojilerimiz, mimari yapıların her detayını yakalayarak, 
                  dijital ortamda gerçeğe en yakın görselleştirmeyi sağlamaktadır. Bu teknoloji, 
                  yapıların belgelenmesi, restorasyonu ve sanal ortamda sergilenmesi için 
                  geniş imkanlar sunmaktadır.
                </p>
              </div>
            </div>
            
            <div className="relative w-full reveal">
              <img 
                src={project.additionalImages[0] || "/placeholder.svg"} 
                alt={project.title}
                className="w-full h-auto rounded-lg"
              />
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/20 blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-secondary/20 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Section 4: Project Gallery */}
      <section className="min-h-screen bg-background flex items-center">
        <div className="section-container py-20">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center reveal">Proje Galerisi</h2>
          
          <Carousel className="w-full max-w-5xl mx-auto reveal">
            <CarouselContent>
              {project.additionalImages.map((image, index) => (
                <CarouselItem key={index}>
                  <div className="p-1">
                    <div className="aspect-video overflow-hidden rounded-lg">
                      <img 
                        src={image} 
                        alt={`${project.title} görsel ${index + 1}`}
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
      
      {/* Section 5: More Projects */}
      <section className="bg-muted/50 dark:bg-muted/20 py-20">
        <div className="section-container">
          <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center reveal">Diğer Projeler</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {sampleProjects
              .filter(p => p.slug !== slug)
              .slice(0, 3)
              .map(p => (
                <Link 
                  key={p.id} 
                  to={`/projects/${p.slug}`}
                  className="group rounded-lg overflow-hidden bg-muted/50 dark:bg-muted/20 reveal"
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={p.afterImage} 
                      alt={p.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                  </div>
                </Link>
              ))}
          </div>
          
          <div className="flex justify-between mt-12">
            <div>
              {prevProject && (
                <Button asChild variant="outline">
                  <Link to={`/projects/${prevProject.slug}`} className="flex items-center">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Önceki Proje
                  </Link>
                </Button>
              )}
            </div>
            
            <Button asChild>
              <Link to="/projects" className="flex items-center">
                Tüm Projeleri Görüntüle
              </Link>
            </Button>
            
            <div>
              {nextProject && (
                <Button asChild variant="outline">
                  <Link to={`/projects/${nextProject.slug}`} className="flex items-center">
                    Sonraki Proje
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
