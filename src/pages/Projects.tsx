
import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";
import { ExternalLink, Github, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const projects = [
  {
    id: 1,
    title: "Modern E-ticaret Sitesi",
    description:
      "Next.js, Tailwind CSS ve Stripe ile geliştirilmiş tam kapsamlı bir e-ticaret çözümü. Ürün yönetimi, sepet işlemleri, ödeme sistemi ve kullanıcı hesapları içerir.",
    image:
      "https://images.unsplash.com/photo-1661956600684-97d3a4320e45?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    tags: ["Next.js", "Tailwind CSS", "Stripe", "MongoDB"],
    category: "E-ticaret",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
  {
    id: 2,
    title: "İçerik Yönetim Sistemi",
    description:
      "GraphQL API ve React ile geliştirilmiş özelleştirilebilir içerik yönetim sistemi. İçerik oluşturma, düzenleme ve yönetim paneli içerir.",
    image:
      "https://images.unsplash.com/photo-1626908013351-800ddd734b8a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    tags: ["React", "GraphQL", "Node.js", "PostgreSQL"],
    category: "Web Uygulaması",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
  {
    id: 3,
    title: "SaaS Gösterge Paneli",
    description:
      "TypeScript ve React ile geliştirilmiş, veri görselleştirme odaklı admin paneli. Grafikler, tablolar ve performans metrikleri içerir.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    tags: ["TypeScript", "React", "Recharts", "Firebase"],
    category: "SaaS",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
  {
    id: 4,
    title: "Portfolyo Sitesi",
    description:
      "React ve Tailwind CSS ile geliştirilen modern ve minimalist bir portfolyo sitesi. Animasyonlar, dark mode ve responsive tasarım içerir.",
    image:
      "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80",
    tags: ["React", "Tailwind CSS", "Framer Motion"],
    category: "Portfolyo",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
  {
    id: 5,
    title: "Sosyal Medya Uygulaması",
    description:
      "React Native ile geliştirilen mobil sosyal medya uygulaması. Kullanıcı profilleri, gönderiler, beğeniler ve yorumlar içerir.",
    image:
      "https://images.unsplash.com/photo-1611162616475-46b635cb6868?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1074&q=80",
    tags: ["React Native", "Firebase", "Redux"],
    category: "Mobil",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
  {
    id: 6,
    title: "Blog Platformu",
    description:
      "Next.js ve Sanity CMS ile geliştirilen tam kapsamlı bir blog platformu. Zengin metin editörü, kategoriler ve etiketler içerir.",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80",
    tags: ["Next.js", "Sanity CMS", "TypeScript"],
    category: "Blog",
    liveUrl: "https://example.com",
    githubUrl: "https://github.com",
  },
];

const categories = [
  "Tümü",
  "E-ticaret",
  "Web Uygulaması",
  "SaaS",
  "Portfolyo",
  "Mobil",
  "Blog",
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
        <title>Projeler | Modern Minimalist Portfolyo</title>
        <meta
          name="description"
          content="Geliştirdiğim web ve mobil projeler, kullandığım teknolojiler ve demo linkler."
        />
      </Helmet>

      <section className="section-container">
        <h1 className="text-4xl font-bold mb-6 reveal">Projeler</h1>
        
        <div className="mb-8 space-y-6 reveal">
          <p className="text-lg text-muted-foreground">
            Farklı teknolojiler kullanarak geliştirdiğim projelerden bazıları. Her proje için canlı demo ve kaynak koduna erişebilirsiniz.
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
              <div
                key={project.id}
                className="bg-card rounded-lg overflow-hidden border border-border shadow-sm hover:shadow-md transition-all reveal"
              >
                <div className="aspect-video w-full overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-semibold">{project.title}</h3>
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

                  <div className="flex items-center gap-4 pt-2">
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Demo
                    </a>
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  </div>
                </div>
              </div>
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
