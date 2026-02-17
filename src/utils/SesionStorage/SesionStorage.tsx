export function SesionSSTFull(parteSesion) {
    const session = JSON.parse(sessionStorage.getItem("SesionSSTFull") || "{}");
    const nuevaSesion = { ...session, ...parteSesion };
    sessionStorage.setItem("SesionSSTFull", JSON.stringify(nuevaSesion));
}