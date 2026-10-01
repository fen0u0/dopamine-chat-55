import { useState } from "react";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

const SignOutButton = () => {
  const { signOut } = useAuth();
  const [busy, setBusy] = useState(false);

  const handleSignOut = async () => {
    setBusy(true);
    try {
      await signOut();
      window.location.assign("https://google.com");
    } catch (error) {
      console.error("[v0] Sign out failed", error);
      toast.error("sign out glitched. try again?");
      setBusy(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={busy}
      className="w-full mt-2 flex items-center gap-3 py-3 px-2 rounded-xl hover:bg-destructive/10 transition-colors disabled:opacity-50"
    >
      <LogOut className="w-4 h-4 text-destructive" />
      <span className="text-foreground">{busy ? "logging you out..." : "sign out"}</span>
    </button>
  );
};
export default SignOutButton;
