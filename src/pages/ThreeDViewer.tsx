
import { useEffect, useRef } from "react";
import Layout from "@/components/layout/Layout";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function ThreeDViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    // Three.js'i dinamik olarak yükle
    const loadThreeJS = async () => {
      const THREE = window.THREE || await import('https://cdn.skypack.dev/three@0.135.0');
      
      // Sahne, kamera ve renderer oluştur
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0xf0f0f0);
      
      const camera = new THREE.PerspectiveCamera(
        75, 
        containerRef.current!.clientWidth / containerRef.current!.clientHeight, 
        0.1, 
        1000
      );
      camera.position.z = 5;
      
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(containerRef.current!.clientWidth, containerRef.current!.clientHeight);
      containerRef.current!.appendChild(renderer.domElement);
      
      // Işıklandırma ekle
      const ambientLight = new THREE.AmbientLight(0x404040, 1);
      scene.add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
      directionalLight.position.set(1, 1, 1);
      scene.add(directionalLight);
      
      // 3D model oluştur
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const material = new THREE.MeshPhongMaterial({ 
        color: 0x3584e4, 
        specular: 0x111111,
        shininess: 30
      });
      const cube = new THREE.Mesh(geometry, material);
      scene.add(cube);
      
      // İkinci bir model ekle
      const torusGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);
      const torusMaterial = new THREE.MeshPhongMaterial({ 
        color: 0xc061cb, 
        specular: 0x333333,
        shininess: 50
      });
      const torusKnot = new THREE.Mesh(torusGeometry, torusMaterial);
      torusKnot.position.set(2, 0, 0);
      scene.add(torusKnot);
      
      // Üçüncü bir model ekle
      const sphereGeometry = new THREE.SphereGeometry(0.6, 32, 32);
      const sphereMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x33d17a, 
        specular: 0x333333,
        shininess: 40 
      });
      const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
      sphere.position.set(-2, 0, 0);
      scene.add(sphere);
      
      // Zemin ekle
      const planeGeometry = new THREE.PlaneGeometry(10, 10);
      const planeMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xeeeeee, 
        side: THREE.DoubleSide 
      });
      const plane = new THREE.Mesh(planeGeometry, planeMaterial);
      plane.rotation.x = Math.PI / 2;
      plane.position.y = -1.5;
      scene.add(plane);
      
      // Fare kontrolleri için değişkenler
      let isDragging = false;
      let previousMousePosition = {
        x: 0,
        y: 0
      };
      
      // Fare kontrolleri
      const onMouseDown = (e: MouseEvent) => {
        isDragging = true;
      };
      
      const onMouseMove = (e: MouseEvent) => {
        if (isDragging) {
          const deltaMove = {
            x: e.clientX - previousMousePosition.x,
            y: e.clientY - previousMousePosition.y
          };
          
          cube.rotation.y += deltaMove.x * 0.01;
          cube.rotation.x += deltaMove.y * 0.01;
          
          torusKnot.rotation.y += deltaMove.x * 0.01;
          torusKnot.rotation.x += deltaMove.y * 0.01;
          
          sphere.rotation.y += deltaMove.x * 0.01;
          sphere.rotation.x += deltaMove.y * 0.01;
        }
        
        previousMousePosition = {
          x: e.clientX,
          y: e.clientY
        };
      };
      
      const onMouseUp = (e: MouseEvent) => {
        isDragging = false;
      };
      
      // Fare tekerleği kontrolü
      const onWheel = (e: WheelEvent) => {
        camera.position.z += e.deltaY * 0.01;
        // Zoom aralığını sınırla
        camera.position.z = Math.max(2, Math.min(10, camera.position.z));
      };
      
      // Event listener'ları ekle
      containerRef.current!.addEventListener('mousedown', onMouseDown);
      containerRef.current!.addEventListener('mousemove', onMouseMove);
      containerRef.current!.addEventListener('mouseup', onMouseUp);
      containerRef.current!.addEventListener('wheel', onWheel);
      
      // Pencere yeniden boyutlandırma işleyicisi
      const handleResize = () => {
        if (!containerRef.current) return;
        
        camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
      };
      
      window.addEventListener('resize', handleResize);
      
      // Animasyon döngüsü
      const animate = () => {
        requestAnimationFrame(animate);
        
        if (!isDragging) {
          cube.rotation.x += 0.005;
          cube.rotation.y += 0.005;
          
          torusKnot.rotation.x += 0.003;
          torusKnot.rotation.y += 0.003;
          
          sphere.rotation.x += 0.002;
          sphere.rotation.y += 0.002;
        }
        
        renderer.render(scene, camera);
      };
      
      animate();
      
      // Temizleme işlevi
      return () => {
        if (containerRef.current) {
          containerRef.current.removeEventListener('mousedown', onMouseDown);
          containerRef.current.removeEventListener('mousemove', onMouseMove);
          containerRef.current.removeEventListener('mouseup', onMouseUp);
          containerRef.current.removeEventListener('wheel', onWheel);
          containerRef.current.removeChild(renderer.domElement);
        }
        window.removeEventListener('resize', handleResize);
      };
    };
    
    loadThreeJS();
  }, []);

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
          <div ref={containerRef} className="w-full h-[70vh] border border-border rounded-lg shadow-lg overflow-hidden">
            {/* Three.js içeriği buraya yüklenecek */}
            <div className="absolute top-4 left-4 bg-black/50 text-white text-sm p-2 rounded">
              Fare ile sürükleyerek döndürün, tekerlek ile yakınlaştırın
            </div>
          </div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-10 mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-4">3D Görselleştirme Çözümlerimiz</h2>
            <ul className="space-y-4">
              <li className="flex">
                <span className="text-primary mr-2">✓</span>
                <span>Lazer tarama verileri ve nokta bulutlarının web ortamında görselleştirilmesi</span>
              </li>
              <li className="flex">
                <span className="text-primary mr-2">✓</span>
                <span>Fotogrametrik modellerin interaktif sunumu</span>
              </li>
              <li className="flex">
                <span className="text-primary mr-2">✓</span>
                <span>Tarihi yapı ve alanların dijital ikizlerinin oluşturulması</span>
              </li>
              <li className="flex">
                <span className="text-primary mr-2">✓</span>
                <span>3D modellerin web tarayıcı üzerinden erişilebilir hale getirilmesi</span>
              </li>
              <li className="flex">
                <span className="text-primary mr-2">✓</span>
                <span>Three.js ve Potree tabanlı özelleştirilmiş görselleştirme çözümleri</span>
              </li>
            </ul>
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Teknoloji Avantajlarımız</h2>
            <ul className="space-y-4">
              <li className="flex">
                <span className="text-primary mr-2">✓</span>
                <span>Yüksek çözünürlüklü 3D modellerin optimize edilmesi</span>
              </li>
              <li className="flex">
                <span className="text-primary mr-2">✓</span>
                <span>Büyük nokta bulutu verilerinin hızlı yüklenmesi ve görüntülenmesi</span>
              </li>
              <li className="flex">
                <span className="text-primary mr-2">✓</span>
                <span>Mobil cihazlara uyumlu performans optimizasyonları</span>
              </li>
              <li className="flex">
                <span className="text-primary mr-2">✓</span>
                <span>Açık kaynak kütüphanelerinin profesyonel entegrasyonu</span>
              </li>
              <li className="flex">
                <span className="text-primary mr-2">✓</span>
                <span>Özel ölçüm ve analiz araçları geliştirme imkanı</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-muted/30 p-8 rounded-lg mb-16">
          <h2 className="text-2xl font-bold mb-4 text-center">LAS Formatından Potree'ye Dönüşüm</h2>
          <p className="mb-6 text-center text-muted-foreground">
            LAS formatındaki nokta bulutu verilerinizi web'de görüntüleyebilmek için Potree formatına dönüştürmeniz gerekmektedir.
            Aşağıdaki araçları kullanarak dönüştürme işlemini gerçekleştirebilirsiniz.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-muted/10 p-6 rounded-lg border border-muted">
              <h3 className="text-xl font-semibold mb-3">Online Potree Converter</h3>
              <p className="mb-4 text-muted-foreground">
                Potree'nin resmi web sitesinde bulunan online dönüştürücüyü kullanarak LAS dosyalarınızı 
                doğrudan web ortamında Potree formatına dönüştürebilirsiniz.
              </p>
              <Button asChild className="w-full">
                <a href="https://potree.org/potree/converter.html" target="_blank" rel="noopener noreferrer">
                  Online Potree Converter'a Git
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
            
            <div className="bg-white dark:bg-muted/10 p-6 rounded-lg border border-muted">
              <h3 className="text-xl font-semibold mb-3">Potree Desktop Converter</h3>
              <p className="mb-4 text-muted-foreground">
                Büyük nokta bulutu dosyaları için yerel bilgisayarınızda çalışan Potree Converter 
                uygulamasını kullanabilirsiniz. GitHub'dan indirerek kullanabilirsiniz.
              </p>
              <Button asChild variant="outline" className="w-full">
                <a href="https://github.com/potree/PotreeConverter" target="_blank" rel="noopener noreferrer">
                  Potree Converter'ı İndir
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </div>
        
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
