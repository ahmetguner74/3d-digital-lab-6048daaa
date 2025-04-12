
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Proje türü tanımı
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  cover_image: string;
  featured: boolean;
}

interface ProjectsListProps {
  className?: string;
  projectsPerPage?: number;
}

export default function ProjectsList({ className = "", projectsPerPage = 9 }: ProjectsListProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Supabase'den sadece yayında olan projeleri çek
        const { data, error, count } = await supabase
          .from('projects')
          .select('id, title, slug, description, category, cover_image, featured', { count: 'exact' })
          .eq('status', 'Yayında')
          .order('updated_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        console.log("Çekilen projeler:", data);
        
        if (data && data.length > 0) {
          setProjects(data);
          
          // Toplam sayfa sayısını hesapla
          if (count) {
            setTotalPages(Math.ceil(count / projectsPerPage));
          }
        } else {
          console.log("Öne çıkan proje bulunamadı, demo verileri gösteriliyor");
          // Gerçek veri yoksa demo projeleri göster
          const demoProjects: Project[] = [
            {
              id: "1",
              title: "Tarihi Kent Merkezi Dijitalleştirme",
              slug: "tarihi-kent-merkezi",
              description: "Tarihi kent merkezinin 3D lazer tarama teknolojileri ile belgelenmesi ve dijitalleştirilmesi",
              category: "Mimari",
              cover_image: "/placeholder.svg",
              featured: true
            },
            {
              id: "2",
              title: "Arkeolojik Alan Belgeleme",
              slug: "arkeolojik-alan",
              description: "Kazı alanının yüksek çözünürlüklü 3D modellenmesi ve web ortamında sergilenmesi",
              category: "Arkeoloji",
              cover_image: "/placeholder.svg",
              featured: false
            },
            {
              id: "3",
              title: "Müze Eserleri Dijital Arşivi",
              slug: "muze-eserleri",
              description: "Müzedeki eserlerin fotogrametri yöntemiyle 3D olarak arşivlenmesi",
              category: "Müzecilik",
              cover_image: "/placeholder.svg",
              featured: false
            },
            {
              id: "4",
              title: "Tarihi Yapı Restorasyonu",
              slug: "tarihi-yapi-restorasyonu",
              description: "Tarihi yapının 3D taraması ve restorasyon öncesi-sonrası karşılaştırmalı analizleri",
              category: "Restorasyon",
              cover_image: "/placeholder.svg",
              featured: true
            },
            {
              id: "5",
              title: "Kentsel Dönüşüm Projesi",
              slug: "kentsel-donusum",
              description: "Kentsel dönüşüm alanının dijital ikizinin oluşturulması ve simülasyonu",
              category: "Şehircilik",
              cover_image: "/placeholder.svg",
              featured: false
            },
            {
              id: "6",
              title: "Endüstriyel Miras Belgelemesi",
              slug: "endustriyel-miras",
              description: "Tarihi fabrika yapısının detaylı 3D modellemesi ve sanal tur uygulaması",
              category: "Endüstriyel Miras",
              cover_image: "/placeholder.svg",
              featured: false
            }
          ];
          setProjects(demoProjects);
          setTotalPages(Math.ceil(demoProjects.length / projectsPerPage));
        }
      } catch (err: any) {
        console.error('Projeler yüklenirken hata oluştu:', err);
        setError('Projeler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        toast({
          title: "Hata",
          description: "Projeler yüklenirken bir hata oluştu: " + (err.message || err),
          variant: "destructive"
        });
        
        // Hata durumunda demo projeleri göster
        const demoProjects: Project[] = [
          {
            id: "1",
            title: "Tarihi Kent Merkezi Dijitalleştirme",
            slug: "tarihi-kent-merkezi",
            description: "Tarihi kent merkezinin 3D lazer tarama teknolojileri ile belgelenmesi ve dijitalleştirilmesi",
            category: "Mimari",
            cover_image: "/placeholder.svg",
            featured: true
          },
          {
            id: "2",
            title: "Arkeolojik Alan Belgeleme",
            slug: "arkeolojik-alan",
            description: "Kazı alanının yüksek çözünürlüklü 3D modellenmesi ve web ortamında sergilenmesi",
            category: "Arkeoloji",
            cover_image: "/placeholder.svg",
            featured: false
          },
          {
            id: "3",
            title: "Müze Eserleri Dijital Arşivi",
            slug: "muze-eserleri",
            description: "Müzedeki eserlerin fotogrametri yöntemiyle 3D olarak arşivlenmesi",
            category: "Müzecilik",
            cover_image: "/placeholder.svg",
            featured: false
          }
        ];
        setProjects(demoProjects);
        setTotalPages(Math.ceil(demoProjects.length / projectsPerPage));
        
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
    
    // Supabase realtime aboneliği oluştur
    const channel = supabase
      .channel('public:projects')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'projects' }, 
        () => {
          fetchProjects(); // Herhangi bir değişiklikte projeleri yeniden yükle
        })
      .subscribe();
    
    return () => {
      supabase.removeChannel(channel);
    };
  }, [toast, projectsPerPage]);

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

  if (loading) {
    return (
      <div className={`${className} flex flex-col items-center justify-center py-12`}>
        <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
        <p className="text-muted-foreground">Projeler yükleniyor...</p>
      </div>
    );
  }

  return (
    <div className={className}>
      {error && (
        <div className="text-center py-4 mb-6">
          <p className="text-red-500">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm" className="mt-2">
            Yeniden Dene
          </Button>
        </div>
      )}

      {projects.length === 0 && !error ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">Henüz yayınlanmış proje bulunmamaktadır.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
            {getCurrentPageProjects().map((project) => (
              <Link 
                key={project.id} 
                to={`/projects/${project.slug}`}
                className="group overflow-hidden bg-white dark:bg-muted/10 rounded-lg border border-muted shadow-sm hover:shadow-md transition-all duration-300 reveal"
              >
                <div className="aspect-video relative overflow-hidden">
                  <img 
                    src={project.cover_image || "/placeholder.svg"} 
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                  {project.featured && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-blue-600 text-white text-xs font-medium px-2 py-1 rounded-full">
                        Öne Çıkan
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {project.title}
                  </h3>
                  {project.description && (
                    <p className="mt-2 text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  )}
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-sm font-medium text-primary/80">{project.category}</span>
                    <div className="text-sm text-primary flex items-center">
                      Detaylar <ArrowRight className="ml-1 h-3 w-3" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Sayfalama */}
          {totalPages > 1 && (
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
                        className={`cursor-pointer ${currentPage === index + 1 ? 'bg-blue-600 text-white' : 'hover:bg-muted/80'}`}
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
        </>
      )}
    </div>
  );
}
