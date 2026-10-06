// hooks/useAuthForm.ts
import { useState } from "react";

/**
 * État partagé par `Login.tsx` et `Signup.tsx`.
 *
 * Le téléphone est une chaîne et non un nombre : le préfixe international
 * (`+242`) est significatif et certains identifiants commencent par zéro.
 * `email` reste un champ à part car il est optionnel à l'inscription.
 */
export function useAuthForm() {
  /* Onglet du formulaire de connexion. N'agit que sur l'affichage et le rôle
     attendu : l'API n'a qu'une seule route d'authentification. */
  const [role, setRole] = useState<"parent" | "professionnel">("parent");

  // --- État du formulaire ---
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [codeOtp, setCodeOtp] = useState("");
  const [cgu, setCgu] = useState(false);

  // --- État UI ---
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // --- Reset (utile après soumission ou changement de page) ---
  const reset = () => {
    setName("");
    setPhone("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setCgu(false);
    setMessage("");
    setCodeOtp("");
  };

  return {
    role,
    setRole,
    name,
    setName,
    phone,
    setPhone,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    codeOtp,
    setCodeOtp,
    cgu,
    setCgu,
    isLoading,
    setIsLoading,
    message,
    setMessage,
    reset,
  };
}
