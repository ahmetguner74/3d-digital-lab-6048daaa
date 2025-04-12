
import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";
import ProjectsHero from "@/components/projects/ProjectsHero";
import ProjectsList from "@/components/projects/ProjectsList";
import TechnologiesSection from "@/components/projects/TechnologiesSection";

export default function Projects() {
  return (
    <Layout>
      <Helmet>
        <title>Projelerimiz | 3D Mimari Dijitalleştirme Atölyesi</title>
        <meta name="description" content="3D mimari dijitalleştirme projelerimiz. Arkeolojik eserler, tarihi yapılar ve daha fazlası." />
      </Helmet>
      
      <section className="section-container pt-32 pb-20">
        <ProjectsHero />
        <ProjectsList />
        <TechnologiesSection className="mt-24 mb-16" />
      </section>
    </Layout>
  );
}
