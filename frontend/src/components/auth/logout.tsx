import { LogOut } from "lucide-react";
import { useAuthStore } from "../../stores/useAuthStores";
import { Button } from "../ui/button";
import { useNavigate } from "react-router";

const Logout = () => {
  const { signOut } = useAuthStore();
  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/signin");
    } catch (error) {
      console.error(error);
    }
  };

  return <Button onClick={handleLogout} variant="completeGhost"><LogOut className="text-destructive"/>
  Logout
  </Button>;
};

export default Logout;