import { motion } from "framer-motion";
import { Gem } from "lucide-react";
import { useGems } from "@/contexts/GemsContext";
import { useNavigate } from "react-router-dom";

const GemsBadge = () => {
  const { gems } = useGems();
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate("/settings")}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Gem className="w-4 h-4 text-purple-400" />
      <span className="text-sm font-semibold gradient-text">{gems}</span>
    </motion.button>
  );
};

export default GemsBadge;
