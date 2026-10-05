// pages/SignupPro.tsx

import { useState } from "react";
import type { SubmitEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import CustomButton from "../components/ui/CustomButton";
import { ArrowRight } from "lucide-react";
import Layout from "../components/ui/Layout";
import { PasswordInput } from "../components/ui/auth/PasswordInput";
import logo from "../assets/logo.png";
import { registerPro } from "../services/api";
import { useAuthForm } from "../hooks/useAuthForm";

const SignupPro = () => {
  const navigate = useNavigate();
  const {
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
    reset,
  } = useAuthForm();

  const [rpps, setRpps] = useState("");
  const [etablissement, setEtablissement] = useState("");

  const resetAll = () => {
    setRpps("");
    setEtablissement("");
    reset();
  };

  const handleSubmit = async (
    e: SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setMessage("");

    if (!name || !phone || !rpps || !password) {
      setMessage("Veuillez remplir tous les champs obligatoires");
      return;
    }
    if (!cgu) {
      setMessage("Veuillez accepter les conditions générales d'utilisation");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Les deux mots de passe doivent être identiques");
      return;
    }

    setIsLoading(true);
    setMessage("Enregistrement en cours...");

    try {
      await registerPro({
        nom: name,
        telephone: phone,
        email,
        rpps,
        etablissement,
        mot_de_passe: password,
      });
      setMessage("Compte professionnel créé avec succès !");
      resetAll();
      navigate("/login");
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Une erreur est survenue",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div>
        <img src={logo} alt="" width={100} height={10} />
      </div>

      <div className="text-center space-y-2">
        <h1 className="headline-xl-mobile md:headline-xl text-primary">
          Créer un compte Professionnel
        </h1>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto">
          Pour enregistrer les vaccinations et suivre vos patients
        </p>
      </div>

      <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="text-sm font-medium text-primary">
            Nom complet
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-primary/20 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
            placeholder="Dr. Jean Dupont"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="text-sm font-medium text-primary">Téléphone</label>
          <input
            type="tel"
            className="w-full rounded-lg border border-primary/20 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
            placeholder="+242 066010000"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="text-sm font-medium text-primary">Email</label>
          <input
            type="email"
            className="w-full rounded-lg border border-primary/20 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
            placeholder="votre@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="text-sm font-medium text-primary">
            Numéro RPPS
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-primary/20 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
            placeholder="Votre numéro RPPS"
            value={rpps}
            onChange={(e) => setRpps(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="text-sm font-medium text-primary">
            Établissement
          </label>
          <input
            type="text"
            className="w-full rounded-lg border border-primary/20 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
            placeholder="Nom de votre établissement"
            value={etablissement}
            onChange={(e) => setEtablissement(e.target.value)}
          />
        </div>

        <PasswordInput
          label="Mot de passe"
          value={password}
          onChange={setPassword}
          placeholder="Votre mot de passe"
        />

        <PasswordInput
          label="Confirmation mot de passe"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Confirmer le mot de passe"
        />

        <label className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer select-none">
          <input
            type="checkbox"
            checked={cgu}
            onChange={(e) => setCgu(e.target.checked)}
            className="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary/50"
          />
          J'accepte les conditions générales d'utilisation
        </label>

        <CustomButton
          className="w-full py-3 mt-2"
          isLoading={isLoading}
          icon={<ArrowRight />}
          disabled={isLoading}
        >
          Créer mon compte
        </CustomButton>

        <div className="text-accent rounded-xl p-2 font-semibold">
          {message}
        </div>
      </form>

      <p className="text-sm text-muted-foreground">
        Déjà un compte ? <Link to="/login">Se connecter</Link>
      </p>
    </Layout>
  );
};

export default SignupPro;
