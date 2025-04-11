
import { useState, useEffect } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Image, MessageSquare, Users, FileText } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projectCount: 0,
    messageCount: 0,
    visitorCount: 0,
    contentCount: 0
  });

  // Simulated data loading
  useEffect(() => {
    // In a real implementation, this would fetch data from Supabase
    const timer = setTimeout(() => {
      setStats({
        projectCount: 6,
        messageCount: 12,
        visitorCount: 438,
        contentCount: 24
      });
    }, 500);

    return () => clearTimeout(timer);
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
            <div className="text-2xl font-bold">{stats.projectCount}</div>
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
            <div className="text-2xl font-bold">{stats.messageCount}</div>
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
            <div className="text-2xl font-bold">{stats.visitorCount}</div>
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
            <div className="text-2xl font-bold">{stats.contentCount}</div>
            <p className="text-xs text-muted-foreground">
              Toplam içerik sayısı
            </p>
          </CardContent>
        </Card>
      </div>
      
      <div className="mt-8 grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Son Projeler</CardTitle>
            <CardDescription>Son eklenen veya güncellenen projeler</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sivil Mimari Örneği</p>
                  <p className="text-sm text-muted-foreground">2 gün önce güncellendi</p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  Mimari
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Arkeolojik Eserler</p>
                  <p className="text-sm text-muted-foreground">5 gün önce eklendi</p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  Arkeoloji
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Tarihi Yapılar</p>
                  <p className="text-sm text-muted-foreground">1 hafta önce güncellendi</p>
                </div>
                <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                  Restorasyon
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Son Mesajlar</CardTitle>
            <CardDescription>İletişim formundan gelen son mesajlar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Ahmet Yılmaz</p>
                  <p className="text-xs text-muted-foreground">Bugün, 14:32</p>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  Projeleriniz hakkında bilgi almak istiyorum...
                </p>
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Ayşe Kaya</p>
                  <p className="text-xs text-muted-foreground">Dün, 09:15</p>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  Restorasyon projemiz için fiyat teklifi alabilir miyiz?
                </p>
              </div>
              
              <div>
                <div className="flex items-center justify-between">
                  <p className="font-medium">Mehmet Öz</p>
                  <p className="text-xs text-muted-foreground">2 gün önce, 16:45</p>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-1">
                  Müzemiz için 3D tarama hizmetiniz hakkında görüşmek istiyorum.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
