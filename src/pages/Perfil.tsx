import { useState, useEffect } from "react";
import { MainLayout } from "@/components/Layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { apiClient } from "@/services-2/apiClient";
import { User, Credential } from "@/types/interfaces";
import { messages } from "@/i18n/messages";
import { toast } from "sonner";
import { formatters } from "@/utils/formatters";
import { Edit, Save, X, Eye, Mail } from "lucide-react";
import { localState } from "@/utils/localState";

const Perfil = () => {
  const [user, setUser] = useState<User | null>(null);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [isEditingName, setIsEditingName] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [systemPassword, setSystemPassword] = useState("");
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [revealedPassword, setRevealedPassword] = useState("");

  useEffect(() => {
    loadProfile();
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const loadProfile = async () => {
    const userData = await apiClient.getProfile();
    const credentialsData = await apiClient.getCredentials();
    setUser(userData);
    setCredentials(credentialsData);
  };

  const handleSaveName = async () => {
    if (!user) return;
    const success = await apiClient.updateProfile(user);
    if (success) {
      localState.setUserData(user);
      setIsEditingName(false);
      toast.success(messages.perfil.successSave);
    }
  };

  const handleViewPassword = (credential: Credential) => {
    setSelectedCredential(credential);
    setShowPasswordModal(true);
  };

  const handleVerifyPassword = async () => {
    const isValid = await apiClient.verifySystemPassword(systemPassword);
    if (isValid && selectedCredential) {
      // Simular desencriptación mostrando una contraseña ficticia
      setRevealedPassword(`${selectedCredential.service}_Pass_2024!`);
      setShowPasswordModal(false);
      toast.success("Contraseña revelada");
    } else {
      toast.error(messages.perfil.errorPassword);
    }
  };

  const handleTestSMTP = async () => {
    const success = await apiClient.testSMTPConnection();
    if (success) {
      toast.success(messages.perfil.successSMTP);
    } else {
      toast.error(messages.perfil.errorSMTP);
    }
  };

  const closePasswordModal = () => {
    setShowPasswordModal(false);
    setSystemPassword("");
    setSelectedCredential(null);
  };

  if (!user) return null;

  return (
    <MainLayout onBack={null}>
      <div className="space-y-6 max-w-4xl">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">{messages.perfil.title}</h1>
          <p className="text-muted-foreground text-lg">Gestión de credenciales y configuración personal</p>
        </div>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between border-b bg-muted/30">
            <CardTitle className="text-lg">{messages.perfil.nombre}</CardTitle>
            {!isEditingName ? (
              <Button onClick={() => setIsEditingName(true)} variant="outline" size="sm" className="font-medium">
                <Edit className="h-4 w-4 mr-2" />
                {messages.perfil.edit}
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSaveName} variant="default" size="sm" className="font-medium">
                  <Save className="h-4 w-4 mr-2" />
                  {messages.perfil.save}
                </Button>
                <Button onClick={() => setIsEditingName(false)} variant="outline" size="sm" className="font-medium">
                  <X className="h-4 w-4 mr-2" />
                  {messages.perfil.cancel}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="pt-6">
            <Input
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
              disabled={!isEditingName}
              className="text-lg font-medium"
            />
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg">{messages.perfil.fechaHora}</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-3xl font-mono font-bold text-foreground">
              {formatters.formatDateTime(currentTime)}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg">{messages.perfil.credenciales}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-6">
            {credentials.map((cred) => (
              <div key={cred.id} className="border rounded-lg p-5 space-y-3 bg-card shadow-sm hover:shadow-md transition-shadow">
                <h3 className="font-bold text-lg text-foreground">{cred.service}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground mb-2">
                      {messages.perfil.usuario}
                    </Label>
                    <Input value={cred.username} disabled className="mt-1 font-mono text-sm" />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-muted-foreground mb-2">
                      {messages.perfil.contrasena}
                    </Label>
                    <div className="flex gap-2 mt-1">
                      <Input
                        value={
                          revealedPassword && selectedCredential?.id === cred.id
                            ? revealedPassword
                            : formatters.maskPassword("12345678")
                        }
                        disabled
                        type={
                          revealedPassword && selectedCredential?.id === cred.id
                            ? "text"
                            : "password"
                        }
                        className="font-mono text-sm"
                      />
                      <Button
                        onClick={() => handleViewPassword(cred)}
                        variant="outline"
                        size="sm"
                        className="font-medium"
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <Button onClick={handleTestSMTP} variant="secondary" className="w-full font-semibold">
              <Mail className="h-4 w-4 mr-2" />
              {messages.perfil.probarSMTP}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showPasswordModal} onOpenChange={closePasswordModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{messages.perfil.modalTitle}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-muted-foreground font-medium">{messages.perfil.modalText}</p>
            <Input
              type="password"
              value={systemPassword}
              onChange={(e) => setSystemPassword(e.target.value)}
              placeholder="Contraseña del sistema"
              onKeyDown={(e) => e.key === "Enter" && handleVerifyPassword()}
              className="h-11"
            />
          </div>
          <DialogFooter>
            <Button onClick={closePasswordModal} variant="outline" className="font-medium">
              {messages.perfil.modalCancel}
            </Button>
            <Button onClick={handleVerifyPassword} variant="default" className="font-medium">
              {messages.perfil.modalVerify}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Perfil;
