import { useEffect } from "react";
import { watchUser } from "@/lib/local-auth";
import { applySession, clearLocalProfile, readProfile, signOutProfile } from "@/lib/app-settings";
import { obtenerUsuario } from "@/lib/db/usuarios";

/**
 * Mantiene viva la sesión del prototipo: la cuenta se recuerda en el
 * navegador y aquí se vuelve a cargar su perfil guardado.
 */
export function LocalSession() {
  useEffect(() => {
    const stop = watchUser(async (user) => {
      if (!user) {
        if (readProfile().signedIn || readProfile().uid) void signOutProfile();
        return;
      }
      const fila = await obtenerUsuario(user.uid);
      if (!fila) {
        // Cuenta sin registro completo (país + términos): no dejamos un perfil vacío.
        if (readProfile().signedIn) clearLocalProfile();
        return;
      }
      applySession({
        uid: fila.uid,
        name: fila.nombre,
        email: user.email ?? "",
        photo: fila.foto ?? user.photoURL ?? "",
        countryFlag: fila.pais_flag,
        countryLabel: fila.pais,
      });
    });
    return () => stop();
  }, []);

  return null;
}
