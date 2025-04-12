import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, FileText, Inbox, Link as LinkIcon, Settings, User } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ContactMessage } from "@/types/supabase-extensions";

export default function AdminDashboard() {
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
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Projeleri al
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*');
        
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
          // Daha güvenli tip dönüşümü - önce unknown olarak değerlendirip sonra ContactMessage[] olarak dönüştürelim
          const safeData = (messageData as unknown) as Partial<ContactMessage>[];
          setMessages(safeData || []);
        }
      } catch (error) {
        console.error("Dashboard verileri yüklenirken hata:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    // Realtime güncellemeleri dinle
    const messagesChannel = supabase
      .channel('dashboard-messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'contact_messages' }, 
        payload => {
          // Mesaj eklendiğinde okunmamış mesaj sayısını güncelle
          if (payload.eventType === 'INSERT') {
            setStats(prev => ({
              ...prev,
              unreadMessages: prev.unreadMessages + 1
            }));
          }
          // Mesaj okunduğunda okunmamış mesaj sayısını güncelle
          else if (payload.eventType === 'UPDATE' && payload.new && payload.old) {
            if (payload.old.read === false && payload.new.read === true) {
              setStats(prev => ({
                ...prev,
                unreadMessages: Math.max(0, prev.unreadMessages - 1)
              }));
            }
            else if (payload.old.read === true && payload.new.read === false) {
              setStats(prev => ({
                ...prev,
                unreadMessages: prev.unreadMessages + 1
              }));
            }
          }
          // Mesaj silindiğinde son mesajları yenile
          else if (payload.eventType === 'DELETE') {
            // Son mesajları güncelle
            supabase
              .from('contact_messages' as any)
              .select('*')
              .order('created_at', { ascending: false })
              .limit(3)
              .then(({ data }) => {
                if (data) {
                  const safeData = (data as unknown) as Partial<ContactMessage>[];
                  setMessages(safeData);
                }
              });
          }
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(messagesChannel);
    };
  }, []);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Toplam Proje</CardTitle>
            <CardDescription>Sistemdeki toplam proje sayısı</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <Link to="/admin/projects" className="text-sm text-muted-foreground hover:underline">
              Projeleri Görüntüle
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Öne Çıkan Projeler</CardTitle>
            <CardDescription>Öne çıkarılmış proje sayısı</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.featuredProjects}</div>
            <Link to="/admin/projects" className="text-sm text-muted-foreground hover:underline">
              Projeleri Görüntüle
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Taslak Projeler</CardTitle>
            <CardDescription>Taslak halindeki proje sayısı</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.draftProjects}</div>
            <Link to="/admin/projects" className="text-sm text-muted-foreground hover:underline">
              Projeleri Görüntüle
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Toplam Ziyaret</CardTitle>
            <CardDescription>Web sitesinin toplam ziyaret sayısı</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalVisits}</div>
            <span className="text-sm text-muted-foreground">
              Şu anda bu özellik desteklenmemektedir.
            </span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Okunmamış Mesajlar</CardTitle>
            <CardDescription>Gelen kutusundaki okunmamış mesaj sayısı</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.unreadMessages}</div>
            <Link to="/admin/messages" className="text-sm text-muted-foreground hover:underline">
              Mesajları Görüntüle
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ayarlar</CardTitle>
            <CardDescription>Web sitesi ayarlarını düzenle</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Settings className="h-4 w-4 inline-block mr-2" />
              Ayarlar
            </div>
            <Link to="/admin/settings" className="text-sm text-muted-foreground hover:underline">
              Ayarları Düzenle
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Son Mesajlar</h2>
        {loading ? (
          <div className="text-center py-4">Yükleniyor...</div>
        ) : messages.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {messages.map((message) => (
              <Card key={message.id}>
                <CardHeader>
                  <CardTitle>{message.subject}</CardTitle>
                  <CardDescription>
                    Gönderen: {message.name} - {formatDate(message.created_at || '')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>
                    {message.message && message.message.length > 100
                      ? message.message.substring(0, 100) + "..."
                      : message.message}
                  </p>
                  <Link to="/admin/messages" className="text-sm text-muted-foreground hover:underline">
                    Mesajı Görüntüle
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">Henüz mesaj yok.</div>
        )}
      </div>
    </AdminLayout>
  );
}
