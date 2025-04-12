
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Project } from "@/components/projects/types";

interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string;
  sequence_order: number;
}

export function useProjectData(slug: string) {
  const [project, setProject] = useState<Project | null>(null);
  const [projectImages, setProjectImages] = useState<ProjectImage[]>([]);
  const [relatedProjects, setRelatedProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProjectDetails = async () => {
      if (!slug) return;
      try {
        setLoading(true);
        console.log("Proje detayları yükleniyor: ", slug);
        
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*')
          .eq('slug', slug)
          .eq('status', 'Yayında')
          .single();
        
        if (projectError) {
          console.error("Proje yüklenirken hata:", projectError);
          
          // Eğer gerçek veri yoksa, test verisi olarak göster
          if (projectError.code === "PGRST116") {
            loadTestData(slug);
            setLoading(false);
            return;
          } else {
            throw projectError;
          }
        }
        
        if (!projectData) {
          setError('Proje bulunamadı.');
          setLoading(false);
          return;
        }
        
        console.log("Proje verileri:", projectData);
        setProject(projectData);
        
        const { data: imagesData, error: imagesError } = await supabase
          .from('project_images')
          .select('*')
          .eq('project_id', projectData.id)
          .order('sequence_order', { ascending: true });
        
        if (imagesError) {
          console.error('Proje görselleri yüklenirken hata:', imagesError);
        } else {
          console.log("Proje görselleri:", imagesData);
          setProjectImages(imagesData || []);
        }
        
        const { data: relatedData, error: relatedError } = await supabase
          .from('projects')
          .select('*')
          .eq('status', 'Yayında')
          .eq('category', projectData.category)
          .neq('id', projectData.id)
          .limit(3);
        
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

  const loadTestData = (slug: string) => {
    // Test proje verisi
    const testProject: Project = {
      id: '1',
      slug: slug,
      title: 'Test Proje: ' + slug,
      description: 'Bu bir test projesidir. Bu açıklama proje hakkında detaylı bilgi vermek için kullanılır.',
      content: `<p>Bu içerik örnek bir proje içeriğidir.</p><p>Projenin detaylı açıklaması burada yer alacaktır.</p><p>3D modelleme teknolojilerimizle, yapıların her detayını dijital ortama aktarıyoruz. Bu teknoloji, mimari ve arkeolojik değerlerin korunması ve restore edilmesinde büyük öneme sahiptir.</p>`,
      category: 'Test Kategori',
      cover_image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131',
      featured: false,
      haspointcloud: false
    };
    
    setProject(testProject);
    
    // Test görselleri
    const testImages = [
      {
        id: '101',
        project_id: '1',
        image_url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6',
        alt_text: 'before',
        sequence_order: 1
      },
      {
        id: '102',
        project_id: '1',
        image_url: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b',
        alt_text: 'after',
        sequence_order: 2
      },
      {
        id: '103',
        project_id: '1',
        image_url: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
        alt_text: 'additional',
        sequence_order: 3
      }
    ];
    
    setProjectImages(testImages);
    
    // Test ilgili projeler
    const testRelated: Project[] = [
      {
        id: '2',
        slug: 'test-proje-2',
        title: 'İlgili Test Proje 1',
        description: 'İlgili proje açıklaması',
        content: '',
        category: 'Test Kategori',
        cover_image: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d',
        featured: false
      },
      {
        id: '3',
        slug: 'test-proje-3',
        title: 'İlgili Test Proje 2',
        description: 'İlgili proje açıklaması',
        content: '',
        category: 'Test Kategori',
        cover_image: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7',
        featured: false
      }
    ];
    
    setRelatedProjects(testRelated);
  };

  return { project, projectImages, relatedProjects, loading, error };
}
