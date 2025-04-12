
import { Link } from "react-router-dom";
import { Box } from "lucide-react";

export default function ThreeJsButton() {
  return (
    <Link 
      to="/3d-viewer" 
      title="3D Görüntüleyici" 
      className="group flex items-center gap-2 rounded-full transition-all bg-gradient-to-r from-purple-800 to-blue-500 hover:from-purple-900 hover:to-blue-600 text-white font-medium shadow-lg hover:shadow-xl transform hover:scale-105 duration-300 py-[9px] px-[12px] mx-[7px]"
    >
      <Box className="h-5 w-5 transition-transform group-hover:rotate-12" />
      <span className="text-left">3D</span>
    </Link>
  );
}
