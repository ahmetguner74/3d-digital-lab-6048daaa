
import Layout from "@/components/layout/Layout";
import HeroSection from "@/components/home/HeroSection";
import AboutSection from "@/components/home/AboutSection";
import ProjectsSection from "@/components/home/ProjectsSection";
import ContactSection from "@/components/home/ContactSection";
import { Helmet } from "react-helmet-async";

export default function Index() {
  return (
    <Layout>
      <Helmet>
        <title>Anasayfa | Modern Minimalist Portfolyo</title>
        <meta name="description" content="Modern ve minimalist bir kişisel portfolyo sitesi. Profesyonel deneyimler, projeler ve iletişim bilgileri." />
      </Helmet>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </Layout>
  );
}
