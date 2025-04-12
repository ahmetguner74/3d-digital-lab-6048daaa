
import { Helmet } from "react-helmet-async";
import Layout from "@/components/layout/Layout";
import ServicesHero from "@/components/services/ServicesHero";
import ServicesList from "@/components/services/ServicesList";
import ServiceProcess from "@/components/services/ServiceProcess";
import ServicesContact from "@/components/services/ServicesContact";

export default function Services() {
  return (
    <Layout>
      <Helmet>
        <title>Hizmetlerimiz | 3D Dijital Lab</title>
        <meta name="description" content="3D Dijital Lab tarafından sağlanan mimari ve arkeolojik yapı dijitalleştirme hizmetleri. Lazer tarama, fotogrametri ve BIM modelleme." />
      </Helmet>

      <div className="pt-32">
        <ServicesHero />
        <ServicesList />
        <ServiceProcess />
        <ServicesContact />
      </div>
    </Layout>
  );
}
