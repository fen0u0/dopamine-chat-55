import { motion, AnimatePresence } from "framer-motion";
import { X, Shield, AlertTriangle, UserX, Eye, Phone, FileText, ChevronRight } from "lucide-react";

interface SafetyCenterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const safetyOptions = [
  {
    icon: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    title: "Report a Problem",
    description: "Report inappropriate behavior or content",
  },
  {
    icon: <UserX className="w-5 h-5 text-destructive" />,
    title: "Block a User",
    description: "Prevent someone from contacting you",
  },
  {
    icon: <Eye className="w-5 h-5 text-blue-500" />,
    title: "Privacy Settings",
    description: "Control who can see your profile",
  },
  {
    icon: <Phone className="w-5 h-5 text-green-500" />,
    title: "Emergency Contacts",
    description: "Set up trusted contacts for safety",
  },
  {
    icon: <FileText className="w-5 h-5 text-purple-500" />,
    title: "Safety Tips",
    description: "Learn how to stay safe while dating",
  },
];

const SafetyCenterModal = ({ isOpen, onClose }: SafetyCenterModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="glass rounded-3xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Safety Center
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full glass flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
              </div>

              <div className="p-2">
                {safetyOptions.map((option, index) => (
                  <motion.button
                    key={option.title}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-secondary/50 transition-colors"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
                      {option.icon}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-foreground">{option.title}</p>
                      <p className="text-xs text-muted-foreground">{option.description}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </motion.button>
                ))}
              </div>

              <div className="p-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Your safety is our priority. If you're in immediate danger, please contact local authorities.
                </p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SafetyCenterModal;
