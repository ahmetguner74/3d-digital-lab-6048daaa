
import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";
import ProjectsHero from "@/components/projects/ProjectsHero";
import ProjectsList from "@/components/projects/ProjectsList";
import TechnologiesSection from "@/components/projects/TechnologiesSection";

export default function Projects() {
  return (
    <Layout>
      <Helmet>
        <title>Projeler | 3D Dijital Lab</title>
        <meta name="description" content="3D Dijital Lab projelerimiz. Mimari, arkeolojik ve kültürel miras projelerimize göz atın." />
      </Helmet>

      <div className="section-container py-12 md:py-16">
        <ProjectsHero />
        <ProjectsList className="reveal" />
        <TechnologiesSection className="mt-24 reveal" />
      </div>
    </Layout>
  );
}
