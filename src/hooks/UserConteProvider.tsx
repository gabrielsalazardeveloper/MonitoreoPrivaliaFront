import { createContext, useContext, useState } from "react";

// 1. Define la interfaz de los datos
interface Contenido {
    Sesion: boolean;
    Token: string;
    IdUsuario: number;
    Nombre: string;
    ApellidoP: string;
    ApellidoM: string;
    Correo: string;
    Rol: string;
    IdRol: string;
    Telefono: string;
    IdDepartamento: string;
    Departamento: string;
    Saldo: string;
    DatosCompletos: boolean;
    TienDatoFiscal: boolean;
    Password_temporal: boolean;
    TieneSuscripcionActiva: boolean;
    IdPlan?: number; //
    TipoPago: string;
    Vigencia: string;

}

// 2. Crea los contextos tipados
const userContenidoContext = createContext<Contenido | null>(null);
const userSetContenidoContext = createContext<React.Dispatch<React.SetStateAction<Contenido>> | null>(null);

// 3. Hook para consumirlos
export const useUserContenido = () => {
    const contenidoHooks = useContext(userContenidoContext);
    const setContenidoHooks = useContext(userSetContenidoContext);

    if (contenidoHooks === null || setContenidoHooks === null) {
        throw new Error("useUserContenido debe usarse dentro de <UserContenidoProvider>");
    }

    return { contenidoHooks, setContenidoHooks };
};

// 4. Provider que envuelve tu App
export function UserContenidoProvider({ children }: { children: React.ReactNode }) {
    const JsonData = sessionStorage.getItem("SesionSSTFull");
    const dataSST = JsonData ? JSON.parse(JsonData) : {};

    const [_Contenido, setContenido] = useState<Contenido>({
        Sesion: dataSST.SesionSST || false,
        Token: dataSST.TokenSST || "",
        IdUsuario: dataSST.IdUsuarioSST || "",
        Nombre: dataSST.NombreSST || "",
        ApellidoP: dataSST.ApellidoPSST || "",
        ApellidoM: dataSST.ApellidoMSST || "",
        Correo: dataSST.CorreoSST || "",
        Rol: dataSST.RolSST || "",
        IdRol: dataSST.IdRolSST || "",
        Telefono: dataSST.TelefonoSST || "",
        IdDepartamento: dataSST.IdDepartamentoSST || "",
        Departamento: dataSST.DepartamentoSST || "",
        Saldo: dataSST.SaldoSST || "",
        DatosCompletos: dataSST.DatosCompletosSST || false,
        TienDatoFiscal: dataSST.tienDatoFiscalSST || false,
        Password_temporal: dataSST.Password_temporalSST || false,
        TieneSuscripcionActiva:dataSST.tieneSuscripcionActivaSST || false,
        IdPlan: dataSST.IdPlanSST || null,
        TipoPago: dataSST.TipoPagoSST || null,
        Vigencia: dataSST.VigenciaSST || null,
    });

    return (
        <userContenidoContext.Provider value={_Contenido}>
            <userSetContenidoContext.Provider value={setContenido}>
                {children}
            </userSetContenidoContext.Provider>
        </userContenidoContext.Provider>
    );
}
