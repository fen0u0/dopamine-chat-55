import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Shuffle, Ghost, Globe, Clock, MessageCircle, Zap } from "lucide-react";
import { toast } from "sonner";
import {
  generateRandomAlias,
  quirkyPrompts,
  moodOptions,
  vibeOptions,
} from "@/data/profiles";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
}

const activeHoursOptions = ["night owl", "early bird", "all day chaos", "random bursts", "weekends only"];
const replySpeedOptions = ["chaotic", "instant", "thoughtful", "when i remember", "depends on mood"];
const hereForOptions = ["random convos", "deep talks", "chaos", "memes", "venting", "friendship"];
const anonymityOptions = ["100% anon", "semi-anon", "vibes only", "mystery mode"];
const energyOptions = ["unhinged welcomed", "chill vibes", "chaotic energy", "match my energy"];

const EditProfileModal = ({ isOpen, onClose, onSave }: EditProfileModalProps) => {
  const [alias, setAlias] = useState("sleepy_potato42");
  const [bio, setBio] = useState(
    "chronically online | 3am thoughts enthusiast | probably overthinking rn"
  );
  const [timezone, setTimezone] = useState("GMT+5");
  const [selectedMood, setSelectedMood] = useState("✨ manifesting");
  const [selectedVibe, setSelectedVibe] = useState("chaotic good");
  const [activeHours, setActiveHours] = useState("night owl");
  const [replySpeed, setReplySpeed] = useState("chaotic");
  const [quirkyPrompt, setQuirkyPrompt] = useState(quirkyPrompts[0]);
  const [quirkyAnswer, setQuirkyAnswer] = useState(
    "that one embarrassing thing from 2016"
  );
  const [interests, setInterests] = useState<string[]>([
    "memes",
    "late night talks",
    "chaos",
    "overthinking",
    "music",
  ]);
  const [newInterest, setNewInterest] = useState("");
  
  // The Vibe section
  const [hereFor, setHereFor] = useState("random convos");
  const [anonymity, setAnonymity] = useState("100% anon");
  const [energyPref, setEnergyPref] = useState("unhinged welcomed");
  
  // Vibe Check section
  const [greenFlags, setGreenFlags] = useState<string[]>(["good listener", "sends memes", "no small talk"]);
  const [redFlags, setRedFlags] = useState<string[]>(["double texts", "3am overthinking", "spotify wrapped anxiety"]);
  const [newGreenFlag, setNewGreenFlag] = useState("");
  const [newRedFlag, setNewRedFlag] = useState("");

  /* 🔄 LOAD SAVED PROFILE */
  useEffect(() => {
    if (!isOpen) return;

    const saved = localStorage.getItem("profile_data");
    if (!saved) return;

    const data = JSON.parse(saved);

    setAlias(data.alias ?? alias);
    setBio(data.bio ?? bio);
    setTimezone(data.timezone ?? timezone);
    setSelectedMood(data.mood ?? selectedMood);
    setSelectedVibe(data.vibe ?? selectedVibe);
    setActiveHours(data.activeHours ?? activeHours);
    setReplySpeed(data.replySpeed ?? replySpeed);
    setQuirkyPrompt(data.quirkyPrompt ?? quirkyPrompt);
    setQuirkyAnswer(data.quirkyAnswer ?? quirkyAnswer);
    setInterests(data.interests ?? interests);
    setHereFor(data.hereFor ?? hereFor);
    setAnonymity(data.anonymity ?? anonymity);
    setEnergyPref(data.energyPref ?? energyPref);
    setGreenFlags(data.greenFlags ?? greenFlags);
    setRedFlags(data.redFlags ?? redFlags);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  /* 💾 SAVE PROFILE */
  const handleSave = () => {
    const profileData = {
      alias,
      bio,
      timezone,
      mood: selectedMood,
      vibe: selectedVibe,
      activeHours,
      replySpeed,
      quirkyPrompt,
      quirkyAnswer,
      interests,
      hereFor,
      anonymity,
      energyPref,
      greenFlags,
      redFlags,
    };

    localStorage.setItem("profile_data", JSON.stringify(profileData));

    toast.success("profile updated, stranger ✨");
    onSave?.();
    onClose();
  };

  const handleRegenerateAlias = () => {
    const newAlias = generateRandomAlias();
    setAlias(newAlias);
    toast.success(`new identity: ${newAlias} 👻`);
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

  const addGreenFlag = () => {
    if (newGreenFlag.trim() && greenFlags.length < 5) {
      setGreenFlags([...greenFlags, newGreenFlag.trim().toLowerCase()]);
      setNewGreenFlag("");
    }
  };

  const removeGreenFlag = (index: number) => {
    setGreenFlags(greenFlags.filter((_, i) => i !== index));
  };

  const addRedFlag = () => {
    if (newRedFlag.trim() && redFlags.length < 5) {
      setRedFlags([...redFlags, newRedFlag.trim().toLowerCase()]);
      setNewRedFlag("");
    }
  };

  const removeRedFlag = (index: number) => {
    setRedFlags(redFlags.filter((_, i) => i !== index));
  };

  const timezones = [
    "GMT-12","GMT-11","GMT-10","GMT-9","GMT-8","GMT-7","GMT-6","GMT-5",
    "GMT-4","GMT-3","GMT-2","GMT-1","GMT+0","GMT+1","GMT+2","GMT+3",
    "GMT+4","GMT+5","GMT+6","GMT+7","GMT+8","GMT+9","GMT+10","GMT+11","GMT+12",
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
            className="fixed inset-x-4 top-10 bottom-10 z-50 max-w-sm mx-auto overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <div className="glass rounded-3xl h-full flex flex-col">
              {/* HEADER */}
              <div className="flex items-center justify-between p-4 border-b border-border">
                <button
                  onClick={onClose}
                  className="text-muted-foreground font-semibold"
                >
                  cancel
                </button>

                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Ghost className="w-5 h-5 text-primary" />
                  edit alias
                </h2>

                <button
                  onClick={handleSave}
                  className="text-primary font-bold"
                >
                  save
                </button>
              </div>

              {/* CONTENT */}
              <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-3">
                  <motion.div
                    className="w-24 h-24 rounded-full gradient-border flex items-center justify-center bg-card"
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="text-4xl">👻</span>
                  </motion.div>
                  <p className="text-xs text-muted-foreground">
                    no pics, just vibes
                  </p>
                </div>

                {/* Alias */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Ghost className="w-3 h-3" />
                    your alias
                  </label>
                  <div className="flex gap-2 mt-2">
                    <input
                      value={alias}
                      onChange={(e) =>
                        setAlias(
                          e.target.value
                            .toLowerCase()
                            .replace(/\s/g, "_")
                        )
                      }
                      className="flex-1 px-4 py-3 rounded-xl bg-secondary border border-foreground/5 font-mono"
                    />
                    <motion.button
                      onClick={handleRegenerateAlias}
                      className="px-4 py-3 rounded-xl bg-primary text-primary-foreground"
                      whileHover={{ scale: 1.05, rotate: 180 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Shuffle className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>

                {/* Timezone */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Globe className="w-3 h-3" />
                    timezone
                  </label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full mt-2 px-4 py-3 rounded-xl bg-secondary border border-foreground/5"
                  >
                    {timezones.map((tz) => (
                      <option key={tz}>{tz}</option>
                    ))}
                  </select>
                </div>

                {/* Active Hours */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    active hours
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {activeHoursOptions.map((option) => (
                      <motion.button
                        key={option}
                        onClick={() => setActiveHours(option)}
                        className={`pill ${
                          activeHours === option ? "active" : ""
                        }`}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Reply Speed */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <MessageCircle className="w-3 h-3" />
                    reply speed
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {replySpeedOptions.map((option) => (
                      <motion.button
                        key={option}
                        onClick={() => setReplySpeed(option)}
                        className={`pill ${
                          replySpeed === option ? "active" : ""
                        }`}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Mood */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    current mood
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {moodOptions.slice(0, 8).map((mood) => (
                      <motion.button
                        key={mood}
                        onClick={() => setSelectedMood(mood)}
                        className={`pill ${
                          selectedMood === mood ? "active" : ""
                        }`}
                      >
                        {mood}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Vibe */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    <Zap className="w-3 h-3" />
                    your vibe
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {vibeOptions.map((vibe) => (
                      <motion.button
                        key={vibe}
                        onClick={() => setSelectedVibe(vibe)}
                        className={`pill ${
                          selectedVibe === vibe ? "active" : ""
                        }`}
                      >
                        {vibe}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* The Vibe Section */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                    👻 the vibe
                  </label>
                  
                  <div className="mt-3 space-y-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">here for</p>
                      <div className="flex flex-wrap gap-2">
                        {hereForOptions.map((option) => (
                          <motion.button
                            key={option}
                            onClick={() => setHereFor(option)}
                            className={`pill ${hereFor === option ? "active" : ""}`}
                          >
                            {option}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">anonymity</p>
                      <div className="flex flex-wrap gap-2">
                        {anonymityOptions.map((option) => (
                          <motion.button
                            key={option}
                            onClick={() => setAnonymity(option)}
                            className={`pill ${anonymity === option ? "active" : ""}`}
                          >
                            {option}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">energy</p>
                      <div className="flex flex-wrap gap-2">
                        {energyOptions.map((option) => (
                          <motion.button
                            key={option}
                            onClick={() => setEnergyPref(option)}
                            className={`pill ${energyPref === option ? "active" : ""}`}
                          >
                            {option}
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Vibe Check - Green & Red Flags */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    vibe check 🚩
                  </label>
                  
                  <div className="mt-3 space-y-4">
                    {/* Green Flags */}
                    <div>
                      <p className="text-xs text-green-500 mb-2">🟢 green flags</p>
                      <div className="flex flex-wrap gap-2">
                        {greenFlags.map((flag, index) => (
                          <motion.button
                            key={flag}
                            onClick={() => removeGreenFlag(index)}
                            className="text-xs px-2 py-1 rounded-full bg-green-500/10 text-green-500 border border-green-500/20 flex items-center gap-1"
                          >
                            {flag}
                            <X className="w-3 h-3" />
                          </motion.button>
                        ))}
                      </div>
                      {greenFlags.length < 5 && (
                        <div className="flex gap-2 mt-2">
                          <input
                            value={newGreenFlag}
                            onChange={(e) => setNewGreenFlag(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addGreenFlag()}
                            className="flex-1 px-3 py-2 rounded-xl bg-secondary border border-foreground/5 text-sm"
                            placeholder="add green flag..."
                          />
                          <button
                            onClick={addGreenFlag}
                            className="px-3 py-2 rounded-xl bg-green-500/20 text-green-500 font-bold text-sm"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                    
                    {/* Red Flags */}
                    <div>
                      <p className="text-xs text-red-500 mb-2">🔴 red flags (affectionate)</p>
                      <div className="flex flex-wrap gap-2">
                        {redFlags.map((flag, index) => (
                          <motion.button
                            key={flag}
                            onClick={() => removeRedFlag(index)}
                            className="text-xs px-2 py-1 rounded-full bg-red-500/10 text-red-500 border border-red-500/20 flex items-center gap-1"
                          >
                            {flag}
                            <X className="w-3 h-3" />
                          </motion.button>
                        ))}
                      </div>
                      {redFlags.length < 5 && (
                        <div className="flex gap-2 mt-2">
                          <input
                            value={newRedFlag}
                            onChange={(e) => setNewRedFlag(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && addRedFlag()}
                            className="flex-1 px-3 py-2 rounded-xl bg-secondary border border-foreground/5 text-sm"
                            placeholder="add red flag..."
                          />
                          <button
                            onClick={addRedFlag}
                            className="px-3 py-2 rounded-xl bg-red-500/20 text-red-500 font-bold text-sm"
                          >
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Unpopular Opinion / Quirky Prompt */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    🎭 unpopular opinion
                  </label>
                  <select
                    value={quirkyPrompt}
                    onChange={(e) => setQuirkyPrompt(e.target.value)}
                    className="w-full mt-2 px-4 py-3 rounded-xl bg-secondary border border-foreground/5"
                  >
                    {quirkyPrompts.map((prompt) => (
                      <option key={prompt} value={prompt}>{prompt}</option>
                    ))}
                  </select>
                  <textarea
                    value={quirkyAnswer}
                    onChange={(e) => setQuirkyAnswer(e.target.value)}
                    rows={2}
                    className="w-full mt-2 px-4 py-3 rounded-xl bg-secondary border border-foreground/5 resize-none"
                    placeholder="your answer..."
                  />
                </div>

                {/* Bio */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    ✨ about this stranger
                  </label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full mt-2 px-4 py-3 rounded-xl bg-secondary border border-foreground/5 resize-none"
                  />
                </div>

                {/* Interests */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                    into ✨
                  </label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {interests.map((interest, index) => (
                      <motion.button
                        key={interest}
                        onClick={() => removeInterest(index)}
                        className="pill active"
                      >
                        {interest}
                        <X className="w-3 h-3 ml-1" />
                      </motion.button>
                    ))}
                  </div>

                  {interests.length < 8 && (
                    <div className="flex gap-2 mt-3">
                      <input
                        value={newInterest}
                        onChange={(e) => setNewInterest(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" && addInterest()
                        }
                        className="flex-1 px-4 py-2 rounded-xl bg-secondary border border-foreground/5"
                        placeholder="add interest..."
                      />
                      <button
                        onClick={addInterest}
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold"
                      >
                        add
                      </button>
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
