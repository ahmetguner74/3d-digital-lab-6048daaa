
import AdminLayout from "@/components/admin/AdminLayout";
import { Button } from "@/components/ui/button";
import { PlusCircle, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import DashboardSummary from "@/components/admin/dashboard/DashboardSummary";
import RecentProjects from "@/components/admin/dashboard/RecentProjects";
import RecentMessages from "@/components/admin/dashboard/RecentMessages";
import { useAdminDashboard } from "@/hooks/useAdminDashboard";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { stats, formattedProjects, messages, loading, refreshing, handleRefresh } = useAdminDashboard();
  
  const onRefresh = () => {
    const message = handleRefresh();
    toast({ description: message });
  };

  return (
    <AdminLayout title="Dashboard">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Yönetim Paneli</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={onRefresh} disabled={loading || refreshing}>
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

      {/* İçerik grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
        {/* Son projeler tablosu */}
        <div className="lg:col-span-2">
          <RecentProjects projects={formattedProjects} isLoading={loading} />
        </div>
        
        {/* Son mesajlar */}
        <div className="lg:col-span-1">
          <RecentMessages messages={messages} isLoading={loading} />
        </div>
      </div>
    </AdminLayout>
  );
}
