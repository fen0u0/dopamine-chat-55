import { motion, AnimatePresence } from "framer-motion";
import { X, Flag, UserX, Trash2, Bell, BellOff, Share2 } from "lucide-react";
import { toast } from "sonner";

interface ChatOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileName: string;
}

const ChatOptionsModal = ({ isOpen, onClose, profileName }: ChatOptionsModalProps) => {
  const options = [
    {
      icon: <BellOff className="w-5 h-5" />,
      label: "Mute notifications",
      onClick: () => {
        toast.success(`Muted notifications for ${profileName}`);
        onClose();
      },
    },
    {
      icon: <Share2 className="w-5 h-5" />,
      label: "Share profile",
      onClick: () => {
        toast.success("Profile link copied!");
        onClose();
      },
    },
    {
      icon: <Flag className="w-5 h-5 text-amber-500" />,
      label: "Report",
      onClick: () => {
        toast.info("Report submitted");
        onClose();
      },
      danger: false,
    },
    {
      icon: <UserX className="w-5 h-5 text-destructive" />,
      label: "Block user",
      onClick: () => {
        toast.success(`${profileName} has been blocked`);
        onClose();
      },
      danger: true,
    },
    {
      icon: <Trash2 className="w-5 h-5 text-destructive" />,
      label: "Delete chat",
      onClick: () => {
        toast.success("Chat deleted");
        onClose();
      },
      danger: true,
    },
  ];

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
            className="fixed inset-x-4 bottom-8 z-50 max-w-sm mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          >
            <div className="glass rounded-3xl overflow-hidden">
              <div className="p-2">
                {options.map((option, index) => (
                  <motion.button
                    key={option.label}
                    onClick={option.onClick}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl hover:bg-secondary/50 transition-colors ${
                      option.danger ? "text-destructive" : "text-foreground"
                    }`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    {option.icon}
                    <span className="font-medium">{option.label}</span>
                  </motion.button>
                ))}
              </div>

              <div className="p-2 border-t border-border">
                <button
                  onClick={onClose}
                  className="w-full p-4 rounded-xl text-center font-semibold text-foreground hover:bg-secondary/50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ChatOptionsModal;
