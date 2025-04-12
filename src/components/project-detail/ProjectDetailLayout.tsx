
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import BeforeAfterSlider from "./BeforeAfterSlider";
import ProjectPointCloud from "./ProjectPointCloud";
import ProjectContent from "./ProjectContent";
import ProjectGallery from "./ProjectGallery";
import RelatedProjects from "./RelatedProjects";
import { Project } from "@/components/projects/types"; // Project tipi için doğrudan import kullanıyoruz

interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text: string;
  sequence_order: number;
}

interface ProjectDetailLayoutProps {
  project: Project;
  projectImages: ProjectImage[];
  relatedProjects: Project[];
}

export default function ProjectDetailLayout({
  project,
  projectImages,
  relatedProjects
}: ProjectDetailLayoutProps) {
  const beforeImage = projectImages.find(img => img.alt_text === "before")?.image_url || project.cover_image || "/placeholder.svg";
  const afterImageFromSet = projectImages.find(img => img.alt_text === "after");
  const afterImage = afterImageFromSet ? afterImageFromSet.image_url : (projectImages.length > 0 ? projectImages[0].image_url : "/placeholder.svg");
  
  return (
    <Layout>
      <Helmet>
        <title>{project.title} | 3D Mimari Dijitalleştirme Atölyesi</title>
        <meta name="description" content={project.description} />
      </Helmet>
      
      <section className="min-h-screen bg-muted/50 dark:bg-muted/20 flex items-center pt-20">
        <div className="section-container py-16">
          <h1 className="text-3xl sm:text-4xl font-bold mb-8 reveal">{project.title}</h1>
          
          <BeforeAfterSlider beforeImage={beforeImage} afterImage={afterImage} />
        </div>
      </section>
      
      {project.haspointcloud && project.pointcloudpath && (
        <ProjectPointCloud project={project} />
      )}
      
      <ProjectContent project={project} projectImages={projectImages} />
      
      {projectImages.length > 0 && (
        <ProjectGallery projectImages={projectImages} projectTitle={project.title} />
      )}
      
      {relatedProjects.length > 0 && (
        <RelatedProjects relatedProjects={relatedProjects} />
      )}
    </Layout>
  );
}
