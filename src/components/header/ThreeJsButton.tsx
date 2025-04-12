
import { Link } from "react-router-dom";
import { Cube3d } from "lucide-react";

export default function ThreeJsButton() {
  return (
    <Link 
      to="/3d-viewer" 
      className="group flex items-center gap-2 px-4 py-2 rounded-full transition-all
                bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600
                text-white font-medium shadow-lg hover:shadow-xl
                transform hover:scale-105 duration-300"
      title="3D Görüntüleyici"
    >
      <Cube3d className="h-5 w-5 transition-transform group-hover:rotate-12" />
      <span>3D Görüntüle</span>
    </Link>
  );
}
