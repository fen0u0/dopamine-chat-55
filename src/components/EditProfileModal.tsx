import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
  const [name, setName] = useState("You");
  const [bio, setBio] = useState("living my best life ✨ | coffee addict ☕ | looking for something real fr");
  const [job, setJob] = useState("Product Designer");
  const [school, setSchool] = useState("NYU");
  const [interests, setInterests] = useState(["travel", "photography", "music", "hiking", "coffee"]);
  const [newInterest, setNewInterest] = useState("");

  const handleSave = () => {
    toast.success("profile updated bestie ✨");
    onClose();
  };

  const addInterest = () => {
    if (newInterest.trim() && interests.length < 8) {
      setInterests([...interests, newInterest.trim().toLowerCase()]);
      setNewInterest("");
    }
  };

  const removeInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

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
            className="fixed inset-x-4 top-10 bottom-10 z-50 max-w-sm mx-auto overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="glass rounded-3xl h-full flex flex-col">
              <div className="flex items-center justify-between p-4 border-b border-border">
                <button onClick={onClose} className="text-muted-foreground font-semibold">
                  cancel
                </button>
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  edit profile
                </h2>
                <button onClick={handleSave} className="text-primary font-bold">
                  save
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Avatar Preview */}
                <div className="flex justify-center">
                  <motion.div 
                    className="w-24 h-24 rounded-full gradient-border flex items-center justify-center bg-card"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-3xl font-extrabold gradient-text">
                      {name.slice(0, 2).toUpperCase()}
                    </span>
                  </motion.div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mt-2 px-4 py-3 rounded-xl bg-secondary border border-foreground/5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-semibold"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">about me</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full mt-2 px-4 py-3 rounded-xl bg-secondary border border-foreground/5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none font-medium"
                  />
                  <p className="text-xs text-muted-foreground mt-1 font-mono">{bio.length}/500</p>
                </div>

                {/* Job */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">job title</label>
                  <input
                    type="text"
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                    className="w-full mt-2 px-4 py-3 rounded-xl bg-secondary border border-foreground/5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-semibold"
                  />
                </div>

                {/* School */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">school</label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full mt-2 px-4 py-3 rounded-xl bg-secondary border border-foreground/5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 font-semibold"
                  />
                </div>

                {/* Interests */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">vibes ✨</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {interests.map((interest, index) => (
                      <motion.button
                        key={interest}
                        onClick={() => removeInterest(index)}
                        className="pill active group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {interest}
                        <X className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.button>
                    ))}
                  </div>
                  {interests.length < 8 && (
                    <div className="flex gap-2 mt-3">
                      <input
                        type="text"
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && addInterest()}
                        placeholder="add a vibe..."
                        className="flex-1 px-4 py-2 rounded-xl bg-secondary border border-foreground/5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium"
                      />
                      <motion.button
                        onClick={addInterest}
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        add
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;