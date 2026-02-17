import { Navigate, Route, Routes } from "react-router-dom";
//importamos las rutas de navegacion creadas en el archivo global que creamos
import { ProtectedRouteLogin } from "@/routes/protected/ProtectedRoute";
import { useUserContenido } from "../hooks/UserConteProvider";
import Login from "../pages/Login";


const RoutesPublicas = () => {
  const { contenidoHooks, setContenidoHooks } = useUserContenido();
  const sesion = contenidoHooks.Sesion;
  return (
    <>
      <Routes>
        <Route element={<ProtectedRouteLogin sesion={sesion} />}>
          <Route path={'/Inicio'} element={<Navigate to={'/Login'} replace />} />
          <Route path="/" element={<Navigate to={'/Login'} replace />} />
          <Route
            path={'/Login'}
            element={
              <Login

              />
            }
          />
          <Route path="*" element={<Navigate to={'/Login'} replace />} />
        </Route>
      </Routes>

    </>
  );
};

export default RoutesPublicas;
