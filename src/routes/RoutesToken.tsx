import { useUserContenido } from '@/hooks/UserConteProvider';
import Dashboard from '@/pages/Dashboard';
import NotFound from '@/pages/NotFound';
import { ProtectedRoute } from "@/routes/protected/ProtectedRoute";
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';

import { TIME_ACTIVITY } from '@/2-services/ApiConstants';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import Jobs from "../pages/Jobs";
import Perfil from "../pages/Perfil";
import Reportes from "../pages/Reportes";
import { RedirectToLast } from './protected/RedirectToLast';

const RoutesToken = () => {
  const { contenidoHooks, setContenidoHooks } = useUserContenido();
  const navigate = useNavigate();

  const back = () => {
    setContenidoHooks({
      ...contenidoHooks,
      Sesion: false,
      Token: "",
      IdUsuario: 0,
      Nombre: "",
      ApellidoP: "",
      ApellidoM: "",
      Correo: "",
      Rol: "",
      IdRol: "",
      Telefono: "",
      IdDepartamento: "",
      Departamento: "",
      Saldo: "",
      DatosCompletos: false
    });
    sessionStorage.clear();
    toast.success("Sesión cerrada exitosamente");
    navigate("/login");
  }

  //:::::::::::::::::::::::: [FUNCION CHECK INACTIVITY] :::::::::::::::::::::::::::::::::::
  const [_loggedIn, setLoggedIn] = useState(true);
  const [_timeActivity, setTimeActivity] = useState(Number(TIME_ACTIVITY));

  const checkForInactivity = () => {
    const expireTime = localStorage.getItem("expireTime");

    if (!expireTime) return; // evita errores si es null

    if (Number(expireTime) < Date.now()) {
      setLoggedIn(false);
      back(); // tu función para cerrar sesión o regresar
    }
  };

  const updateExpireTime = () => {
    const expireTime = Date.now() + _timeActivity;
    localStorage.setItem("expireTime", String(expireTime));
  };

  // Revisar la inactividad cada 30 segundos
  useEffect(() => {
    const interval = setInterval(checkForInactivity, 2000);
    return () => clearInterval(interval);
  }, []);

  // Actualizar el tiempo con cualquier interacción
  useEffect(() => {
    updateExpireTime();

    window.addEventListener("click", updateExpireTime);
    window.addEventListener("keypress", updateExpireTime);
    window.addEventListener("scroll", updateExpireTime);
    window.addEventListener("mousemove", updateExpireTime);

    return () => {
      window.removeEventListener("click", updateExpireTime);
      window.removeEventListener("keypress", updateExpireTime);
      window.removeEventListener("scroll", updateExpireTime);
      window.removeEventListener("mousemove", updateExpireTime);
    };
  }, []);


  return (
    <>
      <Routes>
        <Route
          element={
            <ProtectedRoute
              sesion={contenidoHooks.Sesion}
            />
          }
        >
          <Route path="/dashboard" element={<Dashboard onBack={back} />} />
          <Route path="/reportes" element={<Reportes />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<RedirectToLast />} /> {/* me va a estar redirecionando a la ruta que me quede cuando ponga esto.. */}
        </Route>

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default RoutesToken