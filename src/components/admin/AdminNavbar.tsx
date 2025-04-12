
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, MessageSquare, Settings, FolderOpen, LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  label: string;
  active: boolean;
}

const NavItem = ({ to, icon: Icon, label, active }: NavItemProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all hover:bg-muted/50",
        active ? "bg-muted font-medium" : "text-muted-foreground"
      )}
    >
      <Icon className="h-4 w-4" />
      <span>{label}</span>
    </Link>
  );
};

export default function AdminNavbar() {
  const location = useLocation();
  const pathname = location.pathname;
  
  const navItems = [
    {
      to: "/admin/dashboard",
      icon: LayoutDashboard,
      label: "Dashboard"
    },
    {
      to: "/admin/projects",
      icon: FolderOpen,
      label: "Projeler"
    },
    {
      to: "/admin/messages",
      icon: MessageSquare,
      label: "Mesajlar"
    },
    {
      to: "/admin/settings",
      icon: Settings,
      label: "Ayarlar"
    }
  ];
  
  return (
    <nav className="grid gap-1">
      {navItems.map((item) => (
        <NavItem
          key={item.to}
          to={item.to}
          icon={item.icon}
          label={item.label}
          active={pathname === item.to || pathname.startsWith(item.to + "/")}
        />
      ))}
    </nav>
  );
}
