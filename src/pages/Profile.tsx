import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Edit2, Shuffle } from "lucide-react";
import Header from "@/components/Header";
import BottomNav from "@/components/BottomNav";
import EditProfileModal from "@/components/EditProfileModal";
import { toast } from "sonner";
import { generateRandomAlias } from "@/data/profiles";

// Define a type for profile data
export type ProfileData = {
  alias: string;
  bio: string;
  timezone: string;
  vibe: string;
};

const Profile = () => {
  const navigate = useNavigate();

  // Profile state
  const [profile, setProfile] = useState<ProfileData>({
    alias: "sleepy_potato42",
    bio: "chronically online | 3am thoughts enthusiast | probably overthinking rn",
    timezone: "GMT+5",
    vibe: "chaotic good",
  });

  const [showEditModal, setShowEditModal] = useState(false);

  // Update alias
  const handleRegenerateAlias = () => {
    const newAlias = generateRandomAlias();
    setProfile({ ...profile, alias: newAlias });
    toast.success(`you're now ${newAlias} 👻`);
  };

  // Save changes from modal
  const handleSaveProfile = (updatedProfile: ProfileData) => {
    setProfile(updatedProfile);
    toast.success("Profile updated!");
    setShowEditModal(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header title="your alias" showLogo={false} />

      <main className="pt-20 pb-24 px-4 max-w-2xl mx-auto">
        {/* Profile Card */}
        <motion.div
          className="relative mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="relative rounded-3xl overflow-hidden glass p-8">
            <div className="relative flex flex-col items-center">
              <motion.div 
                className="w-28 h-28 rounded-full gradient-border flex items-center justify-center bg-card mb-4"
                animate={{ scale: [1, 1.02, 1] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <span className="text-5xl">👻</span>
              </motion.div>

              <div className="absolute top-4 right-4 flex gap-2">
                <motion.button 
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-foreground/10"
                  onClick={handleRegenerateAlias}
                  whileHover={{ scale: 1.1, rotate: 180 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Shuffle className="w-4 h-4 text-foreground" />
                </motion.button>
                <motion.button 
                  className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center border border-foreground/10"
                  onClick={() => setShowEditModal(true)}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Edit2 className="w-4 h-4 text-foreground" />
                </motion.button>
              </div>

              <h1 className="text-2xl font-bold text-foreground mb-1 font-mono">
                {profile.alias}
              </h1>
            </div>
          </div>
        </motion.div>
      </main>

      <BottomNav />

      {/* Edit Modal */}
      <EditProfileModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        profile={profile}
        onSave={handleSaveProfile}
      />
    </div>
  );
};

export default Profile;
