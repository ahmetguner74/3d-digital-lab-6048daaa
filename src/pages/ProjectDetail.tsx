
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";
import ProjectDetailLayout from "@/components/project-detail/ProjectDetailLayout";
import { useProjectData } from "@/hooks/useProjectData";

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
    <ProjectDetailLayout
      project={project}
      projectImages={projectImages}
      relatedProjects={relatedProjects}
    />
  );
}

function LoadingView() {
  return (
    <Layout>
      <div className="section-container min-h-screen flex items-center justify-center">
        <div className="animate-spin h-10 w-10 border-4 border-primary border-t-transparent rounded-full"></div>
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
        <div className="text-center">
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
