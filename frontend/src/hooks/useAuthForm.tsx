// hooks/useAuthForm.ts
import { useState } from "react";

export function useAuthForm() {
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
    cgu,
    setCgu,
    isLoading,
    setIsLoading,
    message,
    setMessage,
    codeOtp,
    setCodeOtp,
    reset,
  };
}
