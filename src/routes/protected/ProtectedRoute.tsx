import { Navigate, Outlet, useLocation } from "react-router-dom";

export const ProtectedRouteLogin = ({ sesion }) => { //***JALA BIEN
    const location = useLocation();
    // Si está en LOGIN,
    if (location.pathname !== '/Login') {
        return <Navigate to={'/Login'} replace />;
    }
    return <Outlet />;
};

export const ProtectedRoute = ({ sesion }) => {
    const location = useLocation();
    
    // Definimos qué rutas son consideradas "de entrada" o públicas
    const rutasPublicas = ["/Login","/login", "/Inicio", "/"];
    const esRutaPublica = rutasPublicas.includes(location.pathname);

    // 1. Si está logueado e intenta ir a Login/Inicio -> Al Dashboard
    if (sesion && esRutaPublica) {
        return <Navigate to="/Dashboard" replace />;
    }

    // 2. Si NO está logueado e intenta ir a cualquier ruta privada -> Al Login
    if (!sesion && !esRutaPublica) {
        return <Navigate to="/Login" replace />;
    }

    // 3. En cualquier otro caso, permite el paso
    return <Outlet />;
};