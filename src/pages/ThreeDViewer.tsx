
import { useRef } from "react";
import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowRight, Box } from "lucide-react";
import { Link } from "react-router-dom";
import ThreeScene from "@/components/three/ThreeScene";
import ThreeViewerControls from "@/components/three/ThreeViewerControls";
import ThreeViewerInfo from "@/components/three/ThreeViewerInfo";
import ThreeViewerAdvantages from "@/components/three/ThreeViewerAdvantages";
import ThreeViewerCta from "@/components/three/ThreeViewerCta";

export default function ThreeDViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  return (
    <Layout>
      <Helmet>
        <title>3D Görüntüleyici | 3D Dijital Lab</title>
        <meta name="description" content="Three.js ile oluşturulmuş interaktif 3D modelleme ve görselleştirme teknolojileri." />
      </Helmet>
      
      <section className="section-container pt-32 pb-20">
        <div className="text-center mb-16 reveal">
          <h1 className="text-4xl font-bold mb-6">3D Görselleştirme Teknolojilerimiz</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Three.js tabanlı görselleştirme teknolojilerimiz ile mimari, arkeolojik ve kültürel eserleri etkileşimli olarak deneyimleyin.
          </p>
        </div>
        
        <div className="mb-16">
          <div ref={containerRef} className="w-full h-[70vh] border border-border rounded-lg shadow-lg overflow-hidden relative">
            <ThreeScene containerRef={containerRef} />
            <ThreeViewerControls className="absolute top-4 left-4" />
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <ThreeViewerInfo />
          <ThreeViewerAdvantages />
        </div>

        <ThreeViewerCta className="mb-16" />
        
        <div className="flex justify-center mt-12">
          <Button asChild size="lg" className="bg-blue-600 hover:bg-blue-700">
            <Link to="/projects" className="flex items-center">
              3D Projelerimizi İnceleyin
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
