
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import ThirdSection from "@/components/home/ThirdSection";
import FourthSection from "@/components/home/FourthSection";
import ContactSection from "@/components/home/ContactSection";
import ServicesSection from "@/components/home/ServicesSection";
import StatisticsSection from "@/components/home/StatisticsSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import AllProjectsSection from "@/components/home/AllProjectsSection";
import ThreeDSection from "@/components/home/ThreeDSection";

export default function Index() {
  return (
    <Layout>
      <Helmet>
        <title>3D Dijital Lab | Ana Sayfa</title>
        <meta name="description" content="3D mimari modellemeler, lazer tarama ve fotogrametri teknikleri. Mimari, arkeoloji ve kültürel miras projelerinde 3D teknolojileri kullanıyoruz." />
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
