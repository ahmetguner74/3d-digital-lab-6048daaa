
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";
import ProjectDetailLayout from "@/components/project-detail/ProjectDetailLayout";
import { useProjectData } from "@/hooks/useProjectData";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProjectDetail() {
  const { slug } = useParams();
  const { 
    project,
    projectImages,
    relatedProjects,
    loading,
    error
  } = useProjectData(slug || '');

  if (loading) {
    return <LoadingView />;
  }

  if (error || !project) {
    return <ErrorView error={error} />;
  }

  return (
    <Layout>
      <Helmet>
        <title>{project.title} | 3D Dijital Lab</title>
        <meta name="description" content={project.description || `${project.title} projesi detayları - 3D Dijital Lab tarafından gerçekleştirilmiştir.`} />
        <meta property="og:title" content={`${project.title} | 3D Dijital Lab`} />
        <meta property="og:description" content={project.description || `${project.title} projesi detayları`} />
        {project.cover_image && <meta property="og:image" content={project.cover_image} />}
      </Helmet>
      
      <ProjectDetailLayout
        project={project}
        projectImages={projectImages}
        relatedProjects={relatedProjects}
      />
    </Layout>
  );
}

function LoadingView() {
  return (
    <Layout>
      <div className="section-container min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Proje detayları yükleniyor...</p>
        </div>
      </div>
    </Layout>
  );
}

interface ErrorViewProps {
  error: string | null;
}

function ErrorView({ error }: ErrorViewProps) {
  return (
    <Layout>
      <div className="section-container min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-4">Proje Bulunamadı</h1>
          <p className="mb-6 text-muted-foreground">{error || 'Bu proje mevcut değil veya yayından kaldırılmış olabilir.'}</p>
          <Link to="/projects" className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
            Tüm Projelere Dön
          </Link>
        </div>
      </div>
    </Layout>
  );
}
