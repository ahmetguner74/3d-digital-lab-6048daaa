
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
        <title>Anasayfa | Dijitalleştirme Atölyesi</title>
        <meta name="description" content="Farklı türdeki nesneleri tarıyoruz. Mimari objelerin dijitalleştirilmesi ve 3D tarama hizmetleri." />
      </Helmet>
      <HeroSection />
      <AboutSection />
      <ProjectsSection />
      <ContactSection />
    </Layout>
  );
}
