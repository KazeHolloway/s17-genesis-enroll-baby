// hooks/useAuthForm.ts
import { useState } from "react";

export function useAuthForm() {
  // --- État du formulaire ---
  const [role, setRole] = useState<"parent" | "professionnel">("parent");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [cgu, setCgu] = useState(false);

  // --- État UI ---
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  // --- Reset (utile après soumission ou changement de page) ---
  const reset = () => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setCgu(false);
    setMessage("");
  };

  return {
    role,
    setRole,
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    cgu,
    setCgu,
    isLoading,
    setIsLoading,
    message,
    setMessage,
    reset,
  };
}
