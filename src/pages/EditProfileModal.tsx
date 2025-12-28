import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ProfileData } from "@/pages/Profile";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: ProfileData) => void;
  profile: ProfileData;
}

const EditProfileModal = ({ isOpen, onClose, onSave, profile }: EditProfileModalProps) => {
  const [bio, setBio] = useState(profile.bio);
  const [timezone, setTimezone] = useState(profile.timezone);
  const [vibe, setVibe] = useState(profile.vibe);

  // Reset modal fields when opened
  useEffect(() => {
    if (isOpen) {
      setBio(profile.bio);
      setTimezone(profile.timezone);
      setVibe(profile.vibe);
    }
  }, [isOpen, profile]);

  const handleSave = () => {
    onSave({ ...profile, bio, timezone, vibe });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-background rounded-xl p-6 w-80 max-w-full"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
          >
            <h2 className="text-lg font-bold mb-4">Edit Profile</h2>

            <label className="block mb-2 text-sm font-medium">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full p-2 rounded-md border border-muted-foreground/20 mb-4"
              rows={3}
            />

            <label className="block mb-2 text-sm font-medium">Timezone</label>
            <input
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="w-full p-2 rounded-md border border-muted-foreground/20 mb-4"
            />

            <label className="block mb-2 text-sm font-medium">Vibe</label>
            <input
              value={vibe}
              onChange={(e) => setVibe(e.target.value)}
              className="w-full p-2 rounded-md border border-muted-foreground/20 mb-4"
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-md border border-muted-foreground/30"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
              >
                Save
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EditProfileModal;
