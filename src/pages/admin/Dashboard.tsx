
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import DashboardSummary from "@/components/admin/dashboard/DashboardSummary";
import RecentProjects from "@/components/admin/dashboard/RecentProjects";
import { ContactMessage } from "@/types/supabase-extensions";

export default function AdminDashboard() {
  const { toast } = useToast();
  const [projects, setProjects] = useState<any[]>([]);
  const [stats, setStats] = useState({
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
        // Daha güvenli tip dönüşümü
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

  const handleRefresh = () => {
    setRefreshing(true);
    fetchData();
    toast({
      description: "Dashboard yenileniyor...",
    });
  };
  
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

  // Projeleri formatla
  const formattedProjects = projects.map(project => ({
    id: project.id,
    title: project.title,
    category: project.category,
    status: project.status,
    featured: project.featured || false,
    lastUpdated: new Date(project.updated_at || Date.now()).toLocaleDateString('tr-TR'),
    slug: project.slug
  }));

  return (
    <AdminLayout title="Dashboard">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Yönetim Paneli</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={loading || refreshing}>
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Yenile
          </Button>
          <Button asChild size="sm">
            <Link to="/admin/projects/new">
              <PlusCircle className="mr-2 h-4 w-4" />
              Yeni Proje
            </Link>
          </Button>
        </div>
      </div>

      {/* İstatistik kartları */}
      <DashboardSummary
        totalProjects={stats.totalProjects}
        featuredProjects={stats.featuredProjects}
        totalVisits={stats.totalVisits}
        unreadMessages={stats.unreadMessages}
        isLoading={loading}
      />

      {/* Son projeler tablosu */}
      <div className="mt-8">
        <RecentProjects projects={formattedProjects} isLoading={loading} />
      </div>
    </AdminLayout>
  );
}
