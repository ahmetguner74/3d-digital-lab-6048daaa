
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import ServicesSection from "@/components/home/ServicesSection";
import StatisticsSection from "@/components/home/StatisticsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import AllProjectsSection from "@/components/home/AllProjectsSection";
import ThreeDSection from "@/components/home/ThreeDSection";
import ContactSection from "@/components/home/ContactSection";

export default function Index() {
  return (
    <Layout>
      <Helmet>
        <title>3D Dijital Lab | Mimari Dijitalleştirme Stüdyosu</title>
        <meta name="description" content="Mimari yapılarınız için 3D lazer tarama, fotogrametri ve nokta bulutu teknolojileri. Tarihi yapılardan modern binalara, her türlü mimari eserin dijital ikizini oluşturuyoruz." />
        <meta name="keywords" content="3D, dijitalleştirme, lazer tarama, mimari, fotogrametri, nokta bulutu" />
      </Helmet>

      <HeroSection />
      <ServicesSection />
      <AboutSection />
      <ProjectsSection />
      <ThreeDSection />
      <StatisticsSection />
      <TestimonialsSection />
      <AllProjectsSection />
      <ContactSection />
    </Layout>
  );
}
