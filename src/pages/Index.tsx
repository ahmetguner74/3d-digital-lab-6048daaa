
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import AllProjectsSection from "@/components/home/AllProjectsSection";
import ContactSection from "@/components/home/ContactSection";
import { Helmet } from "react-helmet-async";

export default function Index() {
  return (
    <Layout>
      <Helmet>
        <title>Anasayfa | 3D Mimari Dijitalleştirme Atölyesi</title>
        <meta name="description" content="Mimari ve arkeolojik yapıları 3D teknolojileri ile dijitalleştiriyoruz. Lazer tarama ve fotogrametri çözümlerimizle tanışın." />
      </Helmet>
      <HeroSection />
      <ProjectsSection />
      <AllProjectsSection />
      <ContactSection />
    </Layout>
  );
}
