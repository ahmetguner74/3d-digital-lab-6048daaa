
import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";
import { Search } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";

// Sample project data - This will be fetched from Supabase in a later step
const projects = [
  {
    id: 1,
    title: "Sivil Mimari Örneği",
    description: "Modern ve tarihi yapıların detaylı 3D tarama ve modellemesi",
    image: "/placeholder.svg",
    tags: ["Lazer Tarama", "3D Modelleme", "Mimari"],
    category: "Mimari",
    slug: "sivil-mimari"
  },
  {
    id: 2,
    title: "Arkeolojik Eserler",
    description: "Tarihi eserlerin detaylı 3D modellenmesi ve dijital arşivlenmesi",
    image: "/placeholder.svg",
    tags: ["Fotogrametri", "Dijital Arşivleme", "Arkeoloji"],
    category: "Arkeoloji",
    slug: "arkeolojik-eserler"
  },
  {
    id: 3,
    title: "Tarihi Yapılar",
    description: "Kültürel mirasın korunması için 3D belgeleme ve modelleme",
    image: "/placeholder.svg",
    tags: ["Lazer Tarama", "Kültürel Miras", "Restorasyon"],
    category: "Restorasyon",
    slug: "tarihi-yapilar"
  },
  {
    id: 4,
    title: "Modern Mimari",
    description: "Modern binaların 3D taranması ve modellenmesi",
    image: "/placeholder.svg",
    tags: ["BIM", "Mimari", "Modelleme"],
    category: "Mimari",
    slug: "modern-mimari"
  },
  {
    id: 5,
    title: "Müze Sergileri",
    description: "Müze eserlerinin 3D dijitalleştirilmesi ve interaktif sergilenmesi",
    image: "/placeholder.svg",
    tags: ["Müze", "İnteraktif", "Dijitalleştirme"],
    category: "Müze",
    slug: "muze-sergileri"
  },
  {
    id: 6,
    title: "Kültürel Miras",
    description: "Kaybolmakta olan kültürel mirasın belgelenmesi ve korunması",
    image: "/placeholder.svg",
    tags: ["Kültürel Miras", "Koruma", "Arkeoloji"],
    category: "Koruma",
    slug: "kulturel-miras"
  }
];

const categories = [
  "Tümü",
  "Mimari",
  "Arkeoloji",
  "Restorasyon",
  "Müze",
  "Koruma"
];

export default function Projects() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("Tümü");

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = project.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) || 
      project.description
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      project.tags.some(tag => 
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
    const matchesCategory = activeCategory === "Tümü" || project.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <Layout>
      <Helmet>
        <title>Projeler | 3D Mimari Dijitalleştirme Atölyesi</title>
        <meta
          name="description"
          content="3D mimari dijitalleştirme alanında gerçekleştirdiğimiz projeler. Lazer tarama, fotogrametri ve 3D modelleme çalışmalarımızı inceleyin."
        />
      </Helmet>

      <section className="section-container py-20">
        <h1 className="text-4xl font-bold mb-6 reveal">Projelerimiz</h1>
        
        <div className="mb-8 space-y-6 reveal">
          <p className="text-lg text-muted-foreground">
            3D dijitalleştirme teknolojilerimizle tamamladığımız mimari ve arkeolojik projelerimiz. Her projede, yapıların ve eserlerin en ince detaylarını yakalayarak dijital ortama aktarıyoruz.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Proje ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-1 text-sm rounded-full transition-colors ${
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {filteredProjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.slug}`}
                className="group bg-card rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md transition-all reveal"
              >
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <span className="text-xs px-2 py-1 bg-secondary/20 text-secondary rounded-full">
                      {project.category}
                    </span>
                  </div>
                  
                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {project.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">
              Aramanıza uygun proje bulunamadı.
            </p>
          </div>
        )}
      </section>
    </Layout>
  );
}
