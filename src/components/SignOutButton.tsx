import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth";

const SignOutButton = () => {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  return (
    <button
      onClick={async () => { await signOut(); navigate("/login", { replace: true }); }}
      className="w-full mt-2 flex items-center gap-3 py-3 px-2 rounded-xl hover:bg-destructive/10 transition-colors"
    >
      <LogOut className="w-4 h-4 text-destructive" />
      <span className="text-foreground">sign out</span>
    </button>
  );
};
export default SignOutButton;
