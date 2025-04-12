
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Proje türü tanımı
interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  cover_image: string;
  featured: boolean;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const projectsPerPage = 9;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Supabase'den yayında olan projeleri çek
        const { data, error, count } = await supabase
          .from('projects')
          .select('id, title, slug, description, category, cover_image, featured', { count: 'exact' })
          .eq('status', 'Yayında')
          .order('updated_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        console.log("Tüm projeler:", data);
        setProjects(data || []);
        
        // Toplam sayfa sayısını hesapla
        if (count) {
          setTotalPages(Math.ceil(count / projectsPerPage));
        }

        // Veri yoksa test verilerini ekle
        if (!data || data.length === 0) {
          const testProjects = [
            {
              id: '1',
              title: 'Test Projesi 1',
              slug: 'test-projesi-1',
              description: 'Bu bir test projesidir. Tarihi yapıların dijitalleştirilmesi.',
              category: 'Tarihi Yapılar',
              cover_image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
              featured: true
            },
            {
              id: '2',
              title: 'Test Projesi 2',
              slug: 'test-projesi-2',
              description: 'Bu bir başka test projesidir. Modern binaların 3D taraması.',
              category: 'Modern Yapılar',
              cover_image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
              featured: false
            },
            {
              id: '3',
              title: 'Test Projesi 3',
              slug: 'test-projesi-3',
              description: 'Üçüncü test projesi. Arkeolojik alanların belgelenmesi.',
              category: 'Arkeolojik Eserler',
              cover_image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
              featured: false
            }
          ];
          setProjects(testProjects);
          setTotalPages(1);
        }
      } catch (err) {
        console.error('Projeler yüklenirken hata oluştu:', err);
        setError('Projeler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  // Geçerli sayfadaki projeleri hesapla
  const getCurrentPageProjects = () => {
    const startIndex = (currentPage - 1) * projectsPerPage;
    const endIndex = startIndex + projectsPerPage;
    return projects.slice(startIndex, endIndex);
  };

  // Sayfa değiştirme işlevi
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Layout>
      <Helmet>
        <title>Projelerimiz | 3D Mimari Dijitalleştirme Atölyesi</title>
        <meta name="description" content="3D mimari dijitalleştirme projelerimiz. Arkeolojik eserler, tarihi yapılar ve daha fazlası." />
      </Helmet>
      
      <section className="section-container pt-32 pb-20">
        <div className="text-center mb-16 reveal">
          <h1 className="text-4xl font-bold mb-6">Projelerimiz</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            3D dijitalleştirme alanında gerçekleştirdiğimiz çalışmalarımız. 
            Her bir proje, mimari ve kültürel değerlerin korunmasına katkıda bulunuyor.
          </p>
        </div>
        
        {/* Yükleniyor durumu */}
        {loading && (
          <div className="flex justify-center py-12">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>
        )}
        
        {/* Hata durumu */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Yeniden Dene</Button>
          </div>
        )}
        
        {/* Proje listesi */}
        {!loading && !error && projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground mb-4">Henüz yayınlanmış proje bulunmamaktadır.</p>
          </div>
        )}
        
        {!loading && !error && projects.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {getCurrentPageProjects().map((project) => (
              <Link 
                key={project.id} 
                to={`/projects/${project.slug}`}
                className="group rounded-lg overflow-hidden bg-muted/50 dark:bg-muted/20 reveal"
              >
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={project.cover_image || "/placeholder.svg"} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="mt-2 text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  <p className="text-sm text-primary mt-2">{project.category}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Sayfalama */}
        {projects.length > projectsPerPage && (
          <div className="flex justify-center mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
                
                {Array.from({ length: totalPages }).map((_, index) => (
                  <PaginationItem key={index}>
                    <PaginationLink
                      isActive={currentPage === index + 1}
                      onClick={() => handlePageChange(index + 1)}
                      className={`cursor-pointer ${currentPage === index + 1 ? 'bg-primary text-primary-foreground' : 'bg-muted/50'}`}
                    >
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                
                <PaginationItem>
                  <PaginationNext 
                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
        
        <div className="flex justify-center mt-12">
          <Button asChild size="lg">
            <a href="mailto:info@3ddigitallab.com" className="flex items-center">
              Projeniz İçin Teklif Alın
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
