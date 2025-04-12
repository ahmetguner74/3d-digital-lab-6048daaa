
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

interface Project {
  id: string;
  title: string;
  slug: string;
  description?: string;
  cover_image: string;
  category: string;
}

export default function AllProjectsSection() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const projectsPerPage = 6;

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);

        // Supabase'den yayında olan projeleri çek
        const {
          data,
          error,
          count
        } = await supabase.from('projects').select('id, title, slug, description, cover_image, category', {
          count: 'exact'
        }).eq('status', 'Yayında').order('created_at', {
          ascending: false
        });
        if (error) {
          throw error;
        }
        console.log("Ana sayfa projeleri:", data);
        setProjects(data || []);

        // Toplam sayfa sayısını hesapla
        if (count) {
          setTotalPages(Math.ceil(count / projectsPerPage));
        }
      } catch (err) {
        console.error('Projeler yüklenirken hata oluştu:', err);
        setError('Projeler yüklenirken bir hata oluştu.');
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
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // Veri yoksa varsayılan projeleri göster
  const displayProjects = projects.length > 0 ? getCurrentPageProjects() : [{
    id: "1",
    title: "Sivil Mimari Örneği",
    description: "Sivil mimari örnekleri üzerinde yaptığımız çalışmalar, kültürel mirasın dijital belgelenmesine katkı sağlamaktadır.",
    cover_image: "/placeholder.svg",
    slug: "sivil-mimari",
    category: "Mimari"
  }, {
    id: "2",
    title: "Arkeolojik Eserler",
    description: "Arkeolojik eserlerin korunması ve belgelenmesi için yüksek hassasiyetli 3D tarama teknolojilerimizi kullanıyoruz.",
    cover_image: "/placeholder.svg",
    slug: "arkeolojik-eserler",
    category: "Arkeoloji"
  }, {
    id: "3",
    title: "Tarihi Yapılar",
    description: "Tarihi yapıların dijital arşivlenmesi ve restorasyonunda hayati rol oynayan 3D modelleme hizmetlerimiz.",
    cover_image: "/placeholder.svg",
    slug: "tarihi-yapilar",
    category: "Koruma"
  }, {
    id: "4",
    title: "Modern Mimari",
    description: "Modern mimari projelerin dijitalleştirilmesi ve görselleştirilmesi için yenilikçi çözümler sunuyoruz.",
    cover_image: "/placeholder.svg",
    slug: "modern-mimari",
    category: "Mimari"
  }, {
    id: "5",
    title: "Müze Sergileri",
    description: "Müze sergilerinin dijital ortamda ziyaretçilere sunulması için üç boyutlu modelleme çalışmaları.",
    cover_image: "/placeholder.svg",
    slug: "muze-sergileri",
    category: "Müze"
  }, {
    id: "6",
    title: "Kültürel Miras",
    description: "Kültürel mirasın korunması ve gelecek nesillere aktarılması için dijital belgeleme çözümleri.",
    cover_image: "/placeholder.svg",
    slug: "kulturel-miras",
    category: "Koruma"
  }];

  return <section className="min-h-screen bg-muted/30 dark:bg-background">
      <div className="section-container py-20">
        <div className="text-center mb-16 reveal">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Projelerimiz</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            3D dijitalleştirme alanında gerçekleştirdiğimiz çalışmalarımızdan bazıları.
            Her bir proje, mimari ve kültürel değerlerin korunmasına katkıda bulunuyor.
          </p>
        </div>
        
        {/* Yükleniyor durumu */}
        {loading && <div className="flex justify-center py-12">
            <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
          </div>}
        
        {/* Hata durumu */}
        {error && !loading && <div className="text-center py-4 mb-8">
            <p className="text-red-500 text-sm">{error}</p>
          </div>}
        
        {/* Projeler grid görünümü - Sadece kapak fotoğrafı */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {displayProjects.map((project) => (
            <Link 
              key={project.id} 
              to={`/projects/${project.slug}`}
              className="group overflow-hidden rounded-lg border border-muted shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img 
                  src={project.cover_image || "/placeholder.svg"} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
                
                <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
                  <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                  <p className="text-sm text-white/80">{project.category}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        
        {/* Sayfalama */}
        {projects.length > projectsPerPage && <div className="mt-12">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)} className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                </PaginationItem>
                
                {Array.from({length: totalPages}).map((_, index) => <PaginationItem key={index}>
                    <PaginationLink isActive={currentPage === index + 1} onClick={() => handlePageChange(index + 1)} className={`cursor-pointer ${currentPage === index + 1 ? 'bg-primary text-primary-foreground' : 'bg-muted/50'}`}>
                      {index + 1}
                    </PaginationLink>
                  </PaginationItem>)}
                
                <PaginationItem>
                  <PaginationNext onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)} className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"} />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>}
        
        <div className="flex justify-center mt-12">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link to="/projects" className="flex items-center">
              Tüm Projeleri Görüntüle
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </section>;
}
