import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { supabase } from "@/integrations/supabase/client";
import PointCloudViewer from "@/components/PointCloudViewer";
interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  cover_image: string;
  haspointcloud?: boolean;
  pointcloudpath?: string;
}
interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string;
  sequence_order: number;
}
export default function ProjectDetail() {
  const {
    slug
  } = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [sliderValue, setSliderValue] = useState(50);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        const {
          data: projectData,
          error: projectError
        } = await supabase.from('projects').select('*').eq('slug', slug).eq('status', 'Yayında').single();
        if (projectError) {
          throw projectError;
        }
        if (!projectData) {
          setError('Proje bulunamadı.');
          setLoading(false);
          return;
        }
        setProject(projectData);
        const {
          data: imagesData,
          error: imagesError
        } = await supabase.from('project_images').select('*').eq('project_id', projectData.id).order('sequence_order', {
          ascending: true
        });
        if (imagesError) {
          console.error('Proje görselleri yüklenirken hata:', imagesError);
        } else {
          setProjectImages(imagesData || []);
        }
        const {
          data: relatedData,
          error: relatedError
        } = await supabase.from('projects').select('*').eq('status', 'Yayında').eq('category', projectData.category).neq('id', projectData.id).limit(3);
        if (relatedError) {
          console.error('İlgili projeler yüklenirken hata:', relatedError);
        } else {
          setRelatedProjects(relatedData || []);
        }
      } catch (err) {
        console.error('Proje detayları yüklenirken hata:', err);
        setError('Proje detayları yüklenirken bir hata oluştu.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [slug]);
  const currentIndex = relatedProjects.findIndex(p => p.slug === slug);
  const prevProject = currentIndex > 0 ? relatedProjects[currentIndex - 1] : null;
  const nextProject = currentIndex < relatedProjects.length - 1 ? relatedProjects[currentIndex + 1] : null;
  if (loading) {
    return <Layout>
        <div className="section-container min-h-screen flex items-center justify-center">
          <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      </Layout>;
  }
  if (error || !project) {
    return <Layout>
        <div className="section-container min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Proje Bulunamadı</h1>
            <p className="mb-6 text-muted-foreground">{error || 'Bu proje mevcut değil veya yayından kaldırılmış olabilir.'}</p>
            <Button asChild>
              <Link to="/projects">Tüm Projelere Dön</Link>
            </Button>
          </div>
        </div>
      </Layout>;
  }
  const beforeImage = project.cover_image || "/placeholder.svg";
  const beforeImageFromSet = projectImages.find(img => img.alt_text === "before");
  const afterImageFromSet = projectImages.find(img => img.alt_text === "after");
  const afterImage = afterImageFromSet ? afterImageFromSet.image_url : projectImages.length > 0 ? projectImages[0].image_url : "/placeholder.svg";
  return <Layout>
      <Helmet>
        <title>{project.title} | 3D Mimari Dijitalleştirme Atölyesi</title>
        <meta name="description" content={project.description} />
      </Helmet>
      
      <section className="min-h-screen bg-muted/50 dark:bg-muted/20 flex items-center">
        <div className="bg-zinc-50">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 reveal">{project.title}</h1>
          
          <div className="relative aspect-video w-full max-w-5xl mx-auto border border-border rounded-lg overflow-hidden reveal">
            <div className="relative w-full h-full">
              <img src={afterImage} alt="After" className="absolute w-full h-full object-cover" />
              
              <div className="absolute top-0 left-0 h-full overflow-hidden" style={{
              width: `${sliderValue}%`
            }}>
                <img src={beforeImage} alt="Before" className="w-[100vw] h-full object-cover" />
                
                <div className="absolute top-0 bottom-0 right-0 w-1 bg-primary cursor-ew-resize">
                  <div className="absolute top-1/2 right-0 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full border-4 border-primary bg-white flex items-center justify-center">
                    <div className="flex gap-0.5">
                      <ArrowLeft className="h-3 w-3 text-primary" />
                      <ArrowRight className="h-3 w-3 text-primary" />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 left-4 px-2 py-1 bg-black/50 text-white text-sm rounded">
                Öncesi
              </div>
              <div className="absolute top-4 right-4 px-2 py-1 bg-black/50 text-white text-sm rounded">
                Sonrası
              </div>
            </div>
            
            <div className="mt-4 px-4">
              <Slider value={[sliderValue]} onValueChange={value => setSliderValue(value[0])} max={100} step={1} className="w-full" />
            </div>
          </div>
          
          <p className="text-lg text-center mt-8 max-w-3xl mx-auto text-muted-foreground reveal">
            Kaydırıcıyı hareket ettirerek öncesi ve sonrası arasındaki farkı görebilirsiniz.
          </p>
        </div>
      </section>
      
      {project.haspointcloud && <section className="min-h-screen bg-background flex items-center">
          <div className="section-container py-20">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 reveal">Nokta Bulutu Görüntüleyici</h2>
            
            <div className="w-full rounded-lg overflow-hidden reveal">
              <PointCloudViewer pointCloudPath={project.pointcloudpath || "https://cdn.rawgit.com/potree/potree/develop/pointclouds/lion_takanawa/cloud.js"} />
            </div>
            
            <p className="text-lg text-center mt-8 max-w-3xl mx-auto text-muted-foreground reveal">
              Bu interaktif nokta bulutu modeli, lazer tarama teknolojisi ile elde edilmiş milyonlarca 
              veri noktasını içermektedir. Görüntüyü yakınlaştırıp uzaklaştırabilir, farklı açılardan 
              inceleyebilirsiniz.
            </p>
          </div>
        </section>}
      
      <section className="min-h-screen bg-muted/50 dark:bg-muted/20 flex items-center">
        <div className="section-container py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 reveal">
              <h2 className="text-2xl sm:text-3xl font-bold">Proje Detayları</h2>
              <div className="prose prose-lg max-w-none dark:prose-invert">
                {project.content ? <div dangerouslySetInnerHTML={{
                __html: project.content
              }} /> : <p>{project.description}</p>}
                <p>
                  3D modelleme teknolojilerimiz, mimari yapıların her detayını yakalayarak, 
                  dijital ortamda gerçeğe en yakın görselleştirmeyi sağlamaktadır. Bu teknoloji, 
                  yapıların belgelenmesi, restorasyonu ve sanal ortamda sergilenmesi için 
                  geniş imkanlar sunmaktadır.
                </p>
              </div>
            </div>
            
            <div className="relative w-full reveal">
              <img src={projectImages[0]?.image_url || project.cover_image || "/placeholder.svg"} alt={project.title} className="w-full h-auto rounded-lg" />
              
              <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/20 blur-xl"></div>
              <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-secondary/20 blur-xl"></div>
            </div>
          </div>
        </div>
      </section>
      
      {projectImages.length > 0 && <section className="min-h-screen bg-background flex items-center">
          <div className="section-container py-20">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center reveal">Proje Galerisi</h2>
            
            <Carousel className="w-full max-w-5xl mx-auto reveal">
              <CarouselContent>
                {projectImages.map(image => <CarouselItem key={image.id}>
                    <div className="p-1">
                      <div className="aspect-video overflow-hidden rounded-lg">
                        <img src={image.image_url} alt={image.alt_text || `${project.title} görsel`} className="w-full h-full object-cover" />
                      </div>
                    </div>
                  </CarouselItem>)}
              </CarouselContent>
              <CarouselPrevious className="left-1" />
              <CarouselNext className="right-1" />
            </Carousel>
          </div>
        </section>}
      
      {relatedProjects.length > 0 && <section className="bg-muted/50 dark:bg-muted/20 py-20">
          <div className="section-container">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8 text-center reveal">Diğer Projeler</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProjects.map(p => <Link key={p.id} to={`/projects/${p.slug}`} className="group rounded-lg overflow-hidden bg-muted/50 dark:bg-muted/20 reveal">
                  <div className="aspect-video overflow-hidden">
                    <img src={p.cover_image || "/placeholder.svg"} alt={p.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {p.title}
                    </h3>
                  </div>
                </Link>)}
            </div>
            
            <div className="flex justify-between mt-12">
              <div>
                {prevProject && <Button asChild variant="outline">
                    <Link to={`/projects/${prevProject.slug}`} className="flex items-center">
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Önceki Proje
                    </Link>
                  </Button>}
              </div>
              
              <Button asChild>
                <Link to="/projects" className="flex items-center">
                  Tüm Projeleri Görüntüle
                </Link>
              </Button>
              
              <div>
                {nextProject && <Button asChild variant="outline">
                    <Link to={`/projects/${nextProject.slug}`} className="flex items-center">
                      Sonraki Proje
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>}
              </div>
            </div>
          </div>
        </section>}
    </Layout>;
}