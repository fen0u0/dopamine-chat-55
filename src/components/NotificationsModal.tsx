import { motion, AnimatePresence } from "framer-motion";
import { X, Heart, Star, MessageCircle, Sparkles, Bell } from "lucide-react";

interface Notification {
  id: string;
  type: "like" | "superlike" | "message" | "match";
  name: string;
  time: string;
  read: boolean;
}

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const notifications: Notification[] = [
  { id: "1", type: "like", name: "Sophia", time: "2m ago", read: false },
  { id: "2", type: "superlike", name: "Luna", time: "15m ago", read: false },
  { id: "3", type: "match", name: "Zoe", time: "1h ago", read: true },
  { id: "4", type: "message", name: "Emma", time: "2h ago", read: true },
  { id: "5", type: "like", name: "Mia", time: "3h ago", read: true },
];

const getIcon = (type: string) => {
  switch (type) {
    case "like":
      return <Heart className="w-5 h-5 text-pink-500" fill="currentColor" />;
    case "superlike":
      return <Star className="w-5 h-5 text-blue-500" fill="currentColor" />;
    case "match":
      return <Sparkles className="w-5 h-5 text-amber-500" />;
    case "message":
      return <MessageCircle className="w-5 h-5 text-primary" />;
    default:
      return <Bell className="w-5 h-5 text-muted-foreground" />;
  }
};

const getMessage = (type: string, name: string) => {
  switch (type) {
    case "like":
      return `${name} liked your profile`;
    case "superlike":
      return `${name} super liked you! ⭐`;
    case "match":
      return `You matched with ${name}! 🎉`;
    case "message":
      return `${name} sent you a message`;
    default:
      return "New notification";
  }
};

const NotificationsModal = ({ isOpen, onClose }: NotificationsModalProps) => {
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
            className="fixed inset-x-4 top-20 z-50 max-w-sm mx-auto"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="glass rounded-3xl overflow-hidden">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                  <Bell className="w-5 h-5 text-primary" />
                  Notifications
                </h2>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full glass flex items-center justify-center"
                >
                  <X className="w-4 h-4 text-foreground" />
                </button>
              </div>

              <div className="max-h-80 overflow-y-auto">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    className={`flex items-center gap-3 p-4 hover:bg-secondary/50 transition-colors cursor-pointer ${
                      !notification.read ? "bg-primary/5" : ""
                    } ${index !== notifications.length - 1 ? "border-b border-border" : ""}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div className="w-10 h-10 rounded-full glass flex items-center justify-center">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <p className={`text-sm ${!notification.read ? "font-semibold text-foreground" : "text-foreground"}`}>
                        {getMessage(notification.type, notification.name)}
                      </p>
                      <p className="text-xs text-muted-foreground">{notification.time}</p>
                    </div>
                    {!notification.read && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </motion.div>
                ))}
              </div>

              <div className="p-4 border-t border-border">
                <button className="w-full py-2 text-sm text-primary font-medium hover:underline">
                  Mark all as read
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default NotificationsModal;
