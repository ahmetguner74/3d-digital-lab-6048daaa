
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 px-4">
        <h1 className="text-8xl font-bold text-primary">404</h1>
        <h2 className="text-3xl font-semibold">Sayfa Bulunamadı</h2>
        <p className="text-lg text-muted-foreground max-w-md mx-auto">
          Aradığınız sayfa mevcut değil veya kaldırılmış olabilir. Ana sayfaya dönmeyi deneyin.
        </p>
        <Button asChild size="lg">
          <Link to="/">Ana Sayfaya Dön</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
