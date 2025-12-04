import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Camera, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import profile1 from "@/assets/profile-1.jpg";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const EditProfileModal = ({ isOpen, onClose }: EditProfileModalProps) => {
  const [name, setName] = useState("You");
  const [bio, setBio] = useState("Adventure seeker 🌍 | Coffee lover ☕ | Looking for something real");
  const [job, setJob] = useState("Product Designer");
  const [school, setSchool] = useState("NYU");
  const [images] = useState([profile1]);

  const handleSave = () => {
    toast.success("Profile updated successfully! ✨");
    onClose();
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
                <button onClick={onClose} className="text-muted-foreground">
                  Cancel
                </button>
                <h2 className="text-lg font-semibold text-foreground">Edit Profile</h2>
                <button onClick={handleSave} className="text-primary font-semibold">
                  Save
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Photos */}
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-3">Photos</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {images.map((img, index) => (
                      <div key={index} className="relative aspect-[3/4] rounded-xl overflow-hidden">
                        <img src={img} alt="Profile" className="w-full h-full object-cover" />
                        <button className="absolute top-1 right-1 w-6 h-6 rounded-full bg-destructive flex items-center justify-center">
                          <Trash2 className="w-3 h-3 text-white" />
                        </button>
                      </div>
                    ))}
                    {[...Array(5 - images.length)].map((_, index) => (
                      <motion.button
                        key={`empty-${index}`}
                        className="aspect-[3/4] rounded-xl border-2 border-dashed border-border flex items-center justify-center"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toast.info("Photo picker would open here")}
                      >
                        <Plus className="w-8 h-8 text-muted-foreground" />
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Name */}
                <div>
                  <label className="text-sm font-semibold text-muted-foreground uppercase">Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full mt-2 px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="text-sm font-semibold text-muted-foreground uppercase">About Me</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full mt-2 px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  />
                  <p className="text-xs text-muted-foreground mt-1">{bio.length}/500</p>
                </div>

                {/* Job */}
                <div>
                  <label className="text-sm font-semibold text-muted-foreground uppercase">Job Title</label>
                  <input
                    type="text"
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                    className="w-full mt-2 px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                {/* School */}
                <div>
                  <label className="text-sm font-semibold text-muted-foreground uppercase">School</label>
                  <input
                    type="text"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    className="w-full mt-2 px-4 py-3 rounded-xl bg-secondary border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
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
