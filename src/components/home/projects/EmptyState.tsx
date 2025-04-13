
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function EmptyState() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">Öne Çıkan Projelerimiz</h2>
      <p className="text-muted-foreground text-lg text-center mb-8 max-w-2xl">
        Henüz öne çıkan proje bulunmuyor. Admin panelinden bir projeyi "öne çıkan" olarak işaretleyebilirsiniz.
      </p>
      <Button asChild variant="outline" size="lg">
        <Link to="/projects" className="flex items-center">
          Tüm Projeleri Gör
          <ArrowRight className="ml-2 h-5 w-5" />
        </Link>
      </Button>
    </div>
  );
}
