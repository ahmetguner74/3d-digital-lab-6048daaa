
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Eye, MessageSquare, User } from "lucide-react";
import { Link } from "react-router-dom";

interface StatCardProps {
  title: string;
  value: number | string;
  description: string;
  icon: React.ReactNode;
  linkTo?: string;
  linkText?: string;
}

function StatCard({ title, value, description, icon, linkTo, linkText }: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base font-medium">{title}</CardTitle>
        <div className="p-2 bg-muted rounded-full">{icon}</div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {linkTo && linkText && (
          <Link to={linkTo} className="text-sm text-primary hover:underline mt-2 inline-block">
            {linkText}
          </Link>
        )}
      </CardContent>
    </Card>
  );
}

interface DashboardSummaryProps {
  totalProjects: number;
  featuredProjects: number;
  totalVisits: number;
  unreadMessages: number;
  isLoading?: boolean;
}

export default function DashboardSummary({
  totalProjects,
  featuredProjects,
  totalVisits,
  unreadMessages,
  isLoading = false
}: DashboardSummaryProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div className="h-4 w-24 bg-muted rounded"></div>
              <div className="h-10 w-10 bg-muted rounded-full"></div>
            </CardHeader>
            <CardContent>
              <div className="h-7 w-16 bg-muted rounded mb-2"></div>
              <div className="h-3 w-32 bg-muted rounded"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Projeler"
        value={totalProjects}
        description="Toplam proje sayısı"
        icon={<FileText className="h-4 w-4 text-primary" />}
        linkTo="/admin/projects"
        linkText="Projeleri Görüntüle"
      />
      <StatCard
        title="Öne Çıkan"
        value={featuredProjects}
        description="Öne çıkarılmış projeler"
        icon={<Eye className="h-4 w-4 text-secondary" />}
        linkTo="/admin/projects"
        linkText="Yönet"
      />
      <StatCard
        title="Ziyaretler"
        value={totalVisits}
        description="Bu ay toplam ziyaret"
        icon={<User className="h-4 w-4 text-blue-500" />}
      />
      <StatCard
        title="Mesajlar"
        value={unreadMessages}
        description="Okunmamış mesaj sayısı"
        icon={<MessageSquare className="h-4 w-4 text-orange-500" />}
        linkTo="/admin/messages"
        linkText="Mesajları Görüntüle"
      />
    </div>
  );
}
