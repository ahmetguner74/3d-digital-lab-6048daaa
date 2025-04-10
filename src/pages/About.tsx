
import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";
import { Code, FileText, GraduationCap, Briefcase } from "lucide-react";

const experiences = [
  {
    id: 1,
    title: "Senior Front-end Geliştirici",
    company: "XYZ Technology",
    period: "2021 - Günümüz",
    description: "Modern web uygulamaları geliştirme, ekip liderliği, kod kalitesi standartları oluşturma.",
    technologies: ["React", "TypeScript", "Next.js", "GraphQL"]
  },
  {
    id: 2,
    title: "Front-end Geliştirici",
    company: "ABC Software",
    period: "2019 - 2021",
    description: "E-ticaret platformları için kullanıcı arayüzleri geliştirme, performans optimizasyonu.",
    technologies: ["React", "JavaScript", "Redux", "CSS/SCSS"]
  },
  {
    id: 3,
    title: "UI/UX Tasarımcısı",
    company: "Design Studio",
    period: "2018 - 2019",
    description: "Kullanıcı deneyimi tasarımı, arayüz prototipleme, kullanılabilirlik testleri.",
    technologies: ["Figma", "Adobe XD", "User Testing", "Wireframing"]
  },
];

const education = [
  {
    id: 1,
    degree: "Bilgisayar Mühendisliği, Yüksek Lisans",
    institution: "XYZ Üniversitesi",
    period: "2016 - 2018",
  },
  {
    id: 2,
    degree: "Bilgisayar Mühendisliği, Lisans",
    institution: "ABC Üniversitesi",
    period: "2012 - 2016",
  },
];

const skills = [
  { name: "JavaScript", level: 95 },
  { name: "TypeScript", level: 90 },
  { name: "React", level: 95 },
  { name: "Next.js", level: 85 },
  { name: "HTML/CSS", level: 90 },
  { name: "Tailwind CSS", level: 90 },
  { name: "Node.js", level: 75 },
  { name: "GraphQL", level: 80 },
  { name: "Figma/UI Design", level: 85 },
  { name: "Git/GitHub", level: 90 },
];

const certificates = [
  {
    id: 1,
    name: "Advanced React and Redux",
    issuer: "Udemy",
    date: "2022",
  },
  {
    id: 2,
    name: "TypeScript Deep Dive",
    issuer: "Frontend Masters",
    date: "2021",
  },
  {
    id: 3,
    name: "UI/UX Design Principles",
    issuer: "Interaction Design Foundation",
    date: "2020",
  },
];

export default function About() {
  return (
    <Layout>
      <Helmet>
        <title>Hakkımda | Modern Minimalist Portfolyo</title>
        <meta name="description" content="Profesyonel deneyimlerim, eğitim geçmişim ve yeteneklerim hakkında bilgiler." />
      </Helmet>
      
      <section className="section-container">
        <h1 className="text-4xl font-bold mb-6 reveal">Hakkımda</h1>
        <div className="space-y-12">
          {/* Profesyonel Özet */}
          <div className="space-y-6 reveal">
            <h2 className="text-2xl font-semibold">Profesyonel Özet</h2>
            <p className="text-lg text-muted-foreground">
              5 yıllık deneyimli bir Front-end Geliştirici olarak, modern web teknolojileri ve kullanıcı deneyimi konusunda uzmanlık sahibiyim. React, TypeScript ve modern CSS framework'leri kullanarak performanslı, ölçeklenebilir ve kullanıcı dostu web uygulamaları geliştiriyorum.
            </p>
            <p className="text-lg text-muted-foreground">
              Teknik becerilerin yanı sıra, UI/UX tasarım prensiplerini benimseyerek, hem görsel hem de işlevsel açıdan mükemmel kullanıcı deneyimleri oluşturmaya odaklanıyorum. Problem çözme yeteneğim ve analitik düşünce yapım ile karmaşık teknik zorlukları etkili bir şekilde çözüyorum.
            </p>
            <p className="text-lg text-muted-foreground">
              Çevik metodolojilerle çalışma konusunda deneyimliyim ve ekip çalışmasına değer veriyorum. Sürekli öğrenme ve kendimi geliştirme motivasyonuyla, web teknolojilerindeki en son trendleri ve en iyi uygulamaları yakından takip ediyorum.
            </p>
          </div>
          
          {/* Deneyim */}
          <div className="space-y-6 reveal">
            <div className="flex items-center gap-2">
              <Briefcase className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Deneyim</h2>
            </div>
            <div className="space-y-8">
              {experiences.map((experience) => (
                <div key={experience.id} className="border-l-2 border-primary/30 pl-6 relative">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary"></div>
                  <h3 className="text-xl font-medium">{experience.title}</h3>
                  <p className="text-primary font-medium">{experience.company}</p>
                  <p className="text-sm text-muted-foreground mt-1 mb-2">{experience.period}</p>
                  <p className="text-muted-foreground">{experience.description}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {experience.technologies.map((tech) => (
                      <span key={tech} className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Eğitim */}
          <div className="space-y-6 reveal">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Eğitim</h2>
            </div>
            <div className="space-y-6">
              {education.map((edu) => (
                <div key={edu.id} className="border-l-2 border-primary/30 pl-6 relative">
                  <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-primary"></div>
                  <h3 className="text-xl font-medium">{edu.degree}</h3>
                  <p className="text-primary font-medium">{edu.institution}</p>
                  <p className="text-sm text-muted-foreground">{edu.period}</p>
                </div>
              ))}
            </div>
          </div>
          
          {/* Yetenekler */}
          <div className="space-y-6 reveal">
            <div className="flex items-center gap-2">
              <Code className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Yetenekler</h2>
            </div>
            <div className="space-y-4">
              {skills.map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">{skill.name}</span>
                    <span className="text-muted-foreground">{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full"
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Sertifikalar */}
          <div className="space-y-6 reveal">
            <div className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-primary" />
              <h2 className="text-2xl font-semibold">Sertifikalar</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {certificates.map((cert) => (
                <div
                  key={cert.id}
                  className="p-4 bg-card rounded-lg border border-border shadow-sm"
                >
                  <h3 className="font-medium">{cert.name}</h3>
                  <p className="text-primary text-sm">{cert.issuer}</p>
                  <p className="text-sm text-muted-foreground mt-1">{cert.date}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
