import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/services/apiClient";
import { localState } from "@/utils/localState";
import { messages } from "@/i18n/messages";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { useUserContenido } from "@/hooks/UserConteProvider";
import { SesionSSTFull } from "@/utils/SesionStorage/SesionStorage";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { contenidoHooks, setContenidoHooks } = useUserContenido();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await apiClient.login({ email, password });
      
      if (response.success && response.token && response.user) {
        localState.setAuthToken(response.token);
        localState.setUserData(response.user);
        toast.success("Inicio de sesión exitoso");
        const dataSST = {
          SesionSST: true,
        };
        SesionSSTFull(dataSST);
        setContenidoHooks(prev => ({
          ...prev,
          Sesion: dataSST.SesionSST || false,
        }));
        navigate("/dashboard");
      } else {
        toast.error(response.message || messages.login.error);
      }
    } catch (error) {
      toast.error(messages.login.error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted/30 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 pb-6">
          <CardTitle className="text-3xl text-center font-bold">
            {messages.login.title}
          </CardTitle>
          <p className="text-center text-sm text-muted-foreground font-medium">
            Monitoreo Privalia - Grupo AXXO
          </p>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-semibold">{messages.login.email}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="correo@ejemplo.com"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-semibold">{messages.login.password}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="h-11"
              />
            </div>
            <Button type="submit" className="w-full h-11 font-semibold text-base" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {messages.login.button}
            </Button>
            <p className="text-sm text-muted-foreground text-center mt-4 font-medium">
              Demo: juan.perez@empresa.com / admin123
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
