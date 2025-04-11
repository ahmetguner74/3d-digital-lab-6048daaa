
import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";
import AboutSection from "@/components/home/AboutSection";

export default function About() {
  return (
    <Layout>
      <Helmet>
        <title>Hakkımızda | 3D Mimari Dijitalleştirme Atölyesi</title>
        <meta name="description" content="3D Dijital Lab ekibi ve hikayemiz hakkında bilgi edinin. Mimari yapıları 3D teknolojileriyle nasıl dijitalleştiriyoruz?" />
      </Helmet>

      <div className="pt-32">
        <AboutSection />
      </div>
    </Layout>
  );
}
