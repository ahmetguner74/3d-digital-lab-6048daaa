
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ContactMessage } from "@/types/supabase-extensions";

export type DashboardStats = {
  totalProjects: number;
  featuredProjects: number;
  draftProjects: number;
  totalVisits: number;
  unreadMessages: number;
};

export type FormattedProject = {
  id: string;
  title: string;
  category: string;
  status: string;
  featured: boolean;
  lastUpdated: string;
  slug: string;
};

export function useAdminDashboard() {
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProjects: 0,
    featuredProjects: 0,
    draftProjects: 0,
    totalVisits: 0,
    unreadMessages: 0
  });
  const [messages, setMessages] = useState<Partial<ContactMessage>[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const fetchData = async () => {
    setLoading(true);
    try {
      // Projeleri al
      const { data: projectData, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });
      
      if (!projectError) {
        setProjects(projectData || []);
        
        // İstatistikleri hesapla
        const total = projectData?.length || 0;
        const featured = projectData?.filter(p => p.featured)?.length || 0;
        const draft = projectData?.filter(p => p.status === 'Taslak')?.length || 0;
        
        setStats(prev => ({
          ...prev,
          totalProjects: total,
          featuredProjects: featured,
          draftProjects: draft
        }));
      }
      
      // Okunmamış mesaj sayısını al
      const { count: unreadCount, error: unreadError } = await supabase
        .from('contact_messages' as any)
        .select('*', { count: 'exact' })
        .eq('read', false);
      
      if (!unreadError) {
        setStats(prev => ({
          ...prev,
          unreadMessages: unreadCount || 0
        }));
      }
      
      // Son mesajları al
      const { data: messageData, error: messageError } = await supabase
        .from('contact_messages' as any)
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      
      if (!messageError) {
        const safeData = (messageData as unknown) as Partial<ContactMessage>[];
        setMessages(safeData || []);
      }
    } catch (error) {
      console.error("Dashboard verileri yüklenirken hata:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Projeleri formatla
  const formattedProjects: FormattedProject[] = projects.map(project => ({
    id: project.id,
    title: project.title,
    category: project.category,
    status: project.status,
    featured: project.featured || false,
    lastUpdated: new Date(project.updated_at || Date.now()).toLocaleDateString('tr-TR'),
    slug: project.slug
  }));

  useEffect(() => {
    fetchData();
    
    // Realtime güncellemeleri dinle
    const messagesChannel = supabase
      .channel('dashboard-messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, 
        payload => {
          console.log('Mesaj değişikliği algılandı:', payload);
          fetchData();
        }
      )
      .subscribe();
    
    // Proje değişikliklerini dinle
    const projectsChannel = supabase
      .channel('dashboard-projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, 
        payload => {
          console.log('Proje değişikliği algılandı:', payload);
          fetchData();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(messagesChannel);
      supabase.removeChannel(projectsChannel);
    };
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    return "Dashboard yenileniyor...";
  };

  return {
    stats,
    formattedProjects,
    messages,
    loading,
    refreshing,
    handleRefresh
  };
}
