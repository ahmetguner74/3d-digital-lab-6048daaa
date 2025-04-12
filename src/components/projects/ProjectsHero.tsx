
interface ProjectsHeroProps {
  className?: string;
}

export default function ProjectsHero({ className = "" }: ProjectsHeroProps) {
  return (
    <div className={`${className} text-center mb-16 reveal`}>
      <h1 className="text-4xl font-bold mb-6">Projelerimiz</h1>
      <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
        3D dijitalleştirme alanında gerçekleştirdiğimiz çalışmalarımız. 
        Her bir proje, mimari ve kültürel değerlerin korunmasına katkıda bulunuyor.
      </p>
    </div>
  );
}
