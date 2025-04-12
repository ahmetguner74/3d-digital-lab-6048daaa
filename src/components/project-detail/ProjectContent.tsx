
interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string;
  category: string;
  cover_image: string;
}

interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string;
  sequence_order: number;
}

interface ProjectContentProps {
  project: Project;
  projectImages: ProjectImage[];
}

export default function ProjectContent({ project, projectImages }: ProjectContentProps) {
  return (
    <section className="min-h-screen bg-muted/50 dark:bg-muted/20 flex items-center">
      <div className="section-container py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 reveal">
            <h2 className="text-2xl sm:text-3xl font-bold">Proje Detayları</h2>
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {project.content ? 
                <div dangerouslySetInnerHTML={{ __html: project.content }} /> 
                : 
                <p>{project.description}</p>
              }
              <p>
                3D modelleme teknolojilerimiz, mimari yapıların her detayını yakalayarak, 
                dijital ortamda gerçeğe en yakın görselleştirmeyi sağlamaktadır. Bu teknoloji, 
                yapıların belgelenmesi, restorasyonu ve sanal ortamda sergilenmesi için 
                geniş imkanlar sunmaktadır.
              </p>
            </div>
          </div>
          
          <div className="relative w-full reveal">
            <img 
              src={projectImages[0]?.image_url || project.cover_image || "/placeholder.svg"} 
              alt={project.title} 
              className="w-full h-auto rounded-lg" 
            />
            
            <div className="absolute -top-4 -right-4 h-24 w-24 rounded-full bg-primary/20 blur-xl"></div>
            <div className="absolute -bottom-6 -left-6 h-32 w-32 rounded-full bg-secondary/20 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
