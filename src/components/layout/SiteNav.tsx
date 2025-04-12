
import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils"; 
import { Menu, X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { ThemeToggle } from "./ThemeToggle";

type NavItem = {
  title: string;
  href: string;
  external?: boolean;
};

const navItems: NavItem[] = [
  { title: "Anasayfa", href: "/" },
  { title: "Hakkımızda", href: "/about" },
  { title: "Hizmetler", href: "/services" }, // Hizmetler sayfası navigasyona eklendi
  { title: "Projeler", href: "/projects" },
  { title: "3D Görüntüleyici", href: "/3d-viewer" },
  { title: "İletişim", href: "/contact" },
];

export default function SiteNav() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (!isMobile) {
      setIsOpen(false);
    }
  }, [isMobile]);

  return (
    <>
      <div className="block text-sm items-center max-w-[600px]">
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map((item, i) => (
            <NavLink
              key={i}
              to={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noreferrer" : undefined}
              className={({ isActive }) =>
                cn(
                  "transition-colors hover:text-primary hover:underline hover:underline-offset-4",
                  isActive
                    ? "font-medium text-primary underline underline-offset-4"
                    : "text-foreground/80"
                )
              }
            >
              {item.title}
            </NavLink>
          ))}
        </div>
      </div>
      <button
        className="flex md:hidden"
        onClick={() => setIsOpen(true)}
        aria-label="Open menu"
      >
        <Menu className="h-6 w-6" />
      </button>
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background border-l border-border flex flex-col overflow-y-auto">
          <div className="flex items-center justify-between h-16 px-6 border-b shrink-0">
            <NavLink to="/" onClick={() => setIsOpen(false)}>
              <span className="font-bold">3D Dijital Lab</span>
            </NavLink>
            <button
              className="flex"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="flex flex-col px-4 py-8 space-y-4">
            {navItems.map((item, i) => (
              <NavLink
                key={i}
                to={item.href}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                className={({ isActive }) =>
                  cn(
                    "px-2 py-2 text-lg transition-colors hover:text-primary",
                    isActive
                      ? "font-medium text-primary underline underline-offset-4"
                      : "text-foreground/80"
                  )
                }
                onClick={() => setIsOpen(false)}
              >
                {item.title}
              </NavLink>
            ))}
            <div className="px-2 py-4 border-t">
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
