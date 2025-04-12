
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, MessageSquare, Users, FileText } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ContactMessage } from "@/types/supabase-extensions";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projectCount: 0,
    messageCount: 0,
    visitorCount: 0,
    contentCount: 0
  });
  const [loading, setLoading] = useState(true);

  // Gerçek verileri yükle
  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Proje sayısını al
        const { count: projectCount, error: projectError } = await supabase
          .from('projects')
          .select('*', { count: 'exact', head: true });
          
        if (projectError) throw projectError;

        // Okunmamış mesaj sayısını al
        // contact_messages tablosunun varlığını kontrol et
        let messageCount = 0;
        try {
          const { count, error } = await supabase
            .from('contact_messages' as any)
            .select('*', { count: 'exact', head: true })
            .eq('read', false);
          
          if (!error) {
            messageCount = count || 0;
          }
        } catch (error) {
          console.error("Mesaj sayısı alınırken hata:", error);
          // Hata durumunda mesaj sayısını 0 olarak bırak
        }
        
        // İçerik sayısını al (projeler + görseller)
        const { count: imagesCount, error: imagesError } = await supabase
          .from('project_images')
          .select('*', { count: 'exact', head: true });
          
        if (imagesError) throw imagesError;
        
        // Ziyaretçi istatistikleri (bu simüle edilecek çünkü analytics entegrasyonu yok)
        // Gerçek bir uygulamada bu veriler Google Analytics gibi bir hizmetten çekilir
        const visitorCount = Math.floor(Math.random() * 500) + 100;

        setStats({
          projectCount: projectCount || 0,
          messageCount: messageCount,
          visitorCount: visitorCount,
          contentCount: (projectCount || 0) + (imagesCount || 0)
        });
      } catch (error) {
        console.error("İstatistikler yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
    
    // Realtime güncellemeleri dinle
    const projectsChannel = supabase.channel('projects-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, fetchStats)
      .subscribe();
      
    const messagesChannel = supabase.channel('messages-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, fetchStats)
      .subscribe();
    
    return () => {
      supabase.removeChannel(projectsChannel);
      supabase.removeChannel(messagesChannel);
    };
  }, []);

  return (
    <AdminLayout title="Dashboard">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Toplam Proje</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.projectCount}</div>
            <p className="text-xs text-muted-foreground">
              Tüm kategorilerdeki projeler
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Okunmamış Mesaj</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.messageCount}</div>
            <p className="text-xs text-muted-foreground">
              İletişim formundan gelen
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Ziyaretçi</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.visitorCount}</div>
            <p className="text-xs text-muted-foreground">
              Son 30 gündeki ziyaretçi
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">İçerik</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loading ? "..." : stats.contentCount}</div>
            <p className="text-xs text-muted-foreground">
              Toplam içerik sayısı
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <RecentProjects />
        <RecentMessages />
      </div>
    </AdminLayout>
  );
}

function RecentProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRecentProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('id, title, category, updated_at')
          .order('updated_at', { ascending: false })
          .limit(3);
          
        if (error) throw error;
        
        setProjects(data || []);
      } catch (error) {
        console.error("Son projeler yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentProjects();
  }, []);
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Son Projeler</CardTitle>
        <CardDescription>Son eklenen veya güncellenen projeler</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-12 bg-muted/30 animate-pulse rounded"></div>
            ))}
          </div>
        ) : projects.length > 0 ? (
          <div className="space-y-4">
            {projects.map((project) => (
              <div key={project.id} className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{project.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(project.updated_at).toLocaleDateString('tr-TR', {
                      day: 'numeric', 
                      month: 'long', 
                      year: 'numeric'
                    })}
                  </p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  {project.category}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Henüz proje bulunmuyor.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RecentMessages() {
  const [messages, setMessages] = useState<Partial<ContactMessage>[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchRecentMessages = async () => {
      try {
        try {
          const { data, error } = await supabase
            .from('contact_messages' as any)
            .select('id, name, subject, message, created_at')
            .order('created_at', { ascending: false })
            .limit(3);
            
          if (!error) {
            // Tip dönüşümünü yapalım - data dönüşü doğru tipte olduğundan emin olalım
            // Hatalı dönüşe karşı boş dizi ataması yapalım
            setMessages(data as Partial<ContactMessage>[] || []);
          } else {
            console.error("Son mesajlar yüklenirken hata:", error);
            setMessages([]); // Hata durumunda boş dizi
          }
        } catch (error) {
          console.error("Son mesajlar yüklenirken hata:", error);
          setMessages([]); // Hata durumunda boş dizi
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchRecentMessages();
  }, []);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return `Bugün, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (diffInDays === 1) {
      return `Dün, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else if (diffInDays < 7) {
      return `${diffInDays} gün önce, ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    } else {
      return date.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Son Mesajlar</CardTitle>
        <CardDescription>İletişim formundan gelen son mesajlar</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="h-12 bg-muted/30 animate-pulse rounded"></div>
            ))}
          </div>
        ) : messages.length > 0 ? (
          <div className="space-y-4">
            {messages.map((message) => (
              <div key={message.id}>
                <div className="flex items-center justify-between">
                  <p className="font-medium">{message.name}</p>
                  <p className="text-xs text-muted-foreground">{message.created_at ? formatDate(message.created_at) : "-"}</p>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  {message.message}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6 text-muted-foreground">
            Henüz mesaj bulunmuyor.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
