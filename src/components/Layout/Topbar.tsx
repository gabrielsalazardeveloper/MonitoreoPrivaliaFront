import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { localState } from "@/utils/localState";
import { formatters } from "@/utils/formatters";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { APP_CONFIG } from "@/config";

interface TopbarProps {
  onBack: () => void;
}

export const Topbar = ({  onBack }: TopbarProps) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();
  const user = localState.getUserData();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localState.clearAll();
    toast.success("Sesión cerrada exitosamente");
    navigate("/login");
    onBack();
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-6">
        <h1 className="text-xl font-bold text-foreground tracking-tight">
          {APP_CONFIG.appName}
        </h1>
        <div className="text-sm text-muted-foreground font-medium">
          {formatters.formatDateTime(currentTime)}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-foreground">{user?.name}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="gap-2 hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="h-4 w-4" />
          Salir
        </Button>
      </div>
    </header>
  );
};
