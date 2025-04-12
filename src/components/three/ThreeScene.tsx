
import { useEffect, useRef } from "react";
import * as THREE from 'three';

interface ThreeSceneProps {
  containerRef: React.RefObject<HTMLDivElement>;
}

export default function ThreeScene({ containerRef }: ThreeSceneProps) {
  const viewerInitialized = useRef<boolean>(false);
  
  useEffect(() => {
    if (!containerRef.current || viewerInitialized.current) return;
    
    // Three.js kurulumu
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    
    const camera = new THREE.PerspectiveCamera(
      75, 
      containerRef.current.clientWidth / containerRef.current.clientHeight, 
      0.1, 
      1000
    );
    camera.position.z = 5;
    
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    containerRef.current.appendChild(renderer.domElement);
    
    // Işıklandırma ekle
    const ambientLight = new THREE.AmbientLight(0x404040, 1);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);
    
    // 3D modeller oluştur
    const models = createModels();
    models.forEach(model => scene.add(model));

    // Zemin ekle
    const plane = createFloor();
    scene.add(plane);
    
    // Fare kontrolleri için değişkenler
    let isDragging = false;
    let previousMousePosition = {
      x: 0,
      y: 0
    };
    
    // Fare kontrolleri
    const onMouseDown = () => {
      isDragging = true;
    };
    
    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaMove = {
          x: e.clientX - previousMousePosition.x,
          y: e.clientY - previousMousePosition.y
        };
        
        models.forEach(model => {
          model.rotation.y += deltaMove.x * 0.01;
          model.rotation.x += deltaMove.y * 0.01;
        });
      }
      
      previousMousePosition = {
        x: e.clientX,
        y: e.clientY
      };
    };
    
    const onMouseUp = () => {
      isDragging = false;
    };
    
    // Fare tekerleği kontrolü
    const onWheel = (e: WheelEvent) => {
      camera.position.z += e.deltaY * 0.01;
      // Zoom aralığını sınırla
      camera.position.z = Math.max(2, Math.min(10, camera.position.z));
    };
    
    // Event listener'ları ekle
    containerRef.current.addEventListener('mousedown', onMouseDown);
    containerRef.current.addEventListener('mousemove', onMouseMove);
    containerRef.current.addEventListener('mouseup', onMouseUp);
    containerRef.current.addEventListener('wheel', onWheel);
    
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
        models.forEach((model, index) => {
          const speed = 0.005 - (index * 0.001);
          model.rotation.x += speed;
          model.rotation.y += speed;
        });
      }
      
      renderer.render(scene, camera);
    };
    
    animate();
    viewerInitialized.current = true;
    
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
  }, [containerRef]);
  
  return null;
}

// Yardımcı işlevler
function createModels() {
  // Küp modeli
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({ 
    color: 0x3584e4, 
    specular: 0x111111,
    shininess: 30
  });
  const cube = new THREE.Mesh(geometry, material);
  
  // Torus modeli
  const torusGeometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);
  const torusMaterial = new THREE.MeshPhongMaterial({ 
    color: 0xc061cb, 
    specular: 0x333333,
    shininess: 50
  });
  const torusKnot = new THREE.Mesh(torusGeometry, torusMaterial);
  torusKnot.position.set(2, 0, 0);
  
  // Küre modeli
  const sphereGeometry = new THREE.SphereGeometry(0.6, 32, 32);
  const sphereMaterial = new THREE.MeshPhongMaterial({ 
    color: 0x33d17a, 
    specular: 0x333333,
    shininess: 40 
  });
  const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphere.position.set(-2, 0, 0);
  
  return [cube, torusKnot, sphere];
}

function createFloor() {
  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const planeMaterial = new THREE.MeshBasicMaterial({ 
    color: 0xeeeeee, 
    side: THREE.DoubleSide 
  });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.rotation.x = Math.PI / 2;
  plane.position.y = -1.5;
  
  return plane;
}
