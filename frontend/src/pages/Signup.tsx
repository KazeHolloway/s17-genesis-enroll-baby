import CustomButton from "../components/ui/CustomButton";
import {
  ArrowLeft,
  ArrowRight,
  KeyRound,
  Mail,
  Smartphone,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthForm } from "../hooks/useAuthForm";
import { PasswordInput } from "../components/ui/auth/PasswordInput";
import { inscriptionParent, ApiError } from "../services/api";
import logo from "../assets/logo.png";
import visuel from "../assets/hero-maternity.jpg";

/* Palette verte de l'application, scopée sur la section (les utilitaires
   Tailwind compilent en `var(--color-*)`). */
const PALETTE = {
  ["--color-primary" as string]: "#1b5e52",
  ["--color-secondary" as string]: "#d2e7dc",
} as React.CSSProperties;

const champ =
  "min-w-0 flex-1 border-0 bg-transparent px-0 py-2 text-[13px] text-anthracite outline-none placeholder:text-[#8a938f]";
const controle =
  "flex items-center gap-2 rounded-[10px] border border-gris bg-white px-2.5 transition focus-within:border-primary focus-within:shadow-[0_0_0_3px_rgba(27,94,82,0.12)]";
const etiquette = "text-[12px] font-medium text-muted-foreground";

const Signup = () => {
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
    codeOtp,
    setCodeOtp,
    cgu,
    setCgu,
    isLoading,
    setIsLoading,
    message,
    setMessage,
    reset,
  } = useAuthForm();

  const navigate = useNavigate();

  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    if (!name || !phone || !password || !codeOtp) {
      setMessage("Veuillez remplir tous les champs");
      return;
    }
    if (!cgu) {
      setMessage("Veuillez cocher la case des CGU");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Les deux mots de passe doivent être identiques");
      return;
    }
    if (password.length < 8) {
      setMessage("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    setIsLoading(true);
    setMessage("Création du compte en cours...");

    try {
      /* `POST /api/parents/inscription` est publique : le compte n'existe pas
         encore. Le backend valide le code d'accès, refuse un code déjà utilisé
         et rattache le compte au dossier de l'enfant. La session n'est pas
         ouverte par cet appel, d'où la redirection vers la connexion. */
      await inscriptionParent({
        code_acces: codeOtp.trim(),
        nom: name.trim(),
        telephone: phone.trim(),
        email: email.trim() || undefined,
        mot_de_passe: password,
      });

      setMessage("Compte créé ! Vous pouvez maintenant vous connecter.");
      reset();
      navigate("/login", { replace: true });
    } catch (error) {
      /* Le backend répond `{ success, message }` : « Code d'accès invalide ou
         expiré », « Ce code a déjà été utilisé »… On affiche ses mots plutôt
         qu'un message générique, c'est l'information utile ici. */
      setMessage(
        error instanceof ApiError
          ? error.message
          : "Impossible de créer le compte.",
      );
      setIsLoading(false);
    }
  };

  return (
    /* Fond photo + dégradé vert sur toute la page : le formulaire compact est
       entièrement visible dès l'arrivée, sans défilement. */
    <section
      style={
        {
          backgroundImage: `linear-gradient(160deg, rgba(16, 61, 52, 0.85), rgba(27, 94, 82, 0.55)), url(${visuel})`,
          ...PALETTE,
        } as React.CSSProperties
      }
      className="flex min-h-screen w-full items-center justify-center bg-cover bg-center p-4"
    >
      <div className="w-full max-w-[400px]">
        <Link
          to="/"
          className="mb-3 inline-flex min-h-[30px] w-fit items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs font-semibold text-white btn-interaction hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white/50"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Retour
        </Link>

        <article className="rounded-2xl border border-gris bg-white p-5 shadow-[0_18px_40px_rgba(0,0,0,0.18)]">
          {/* Header compact */}
          <header className="mb-4 text-center">
            <img
              src={logo}
              alt="Logo Enroll Baby"
              className="mx-auto mb-1.5 h-auto w-14 object-contain"
            />
            <h1 className="text-lg font-bold text-primary">
              Créer un compte
            </h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Recevez les rappels de vaccination de votre enfant
            </p>
          </header>

          <form className="flex flex-col gap-2.5" onSubmit={handleSubmit}>
            {/* 2 colonnes pour tout afficher sans défilement */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="col-span-2 flex flex-col gap-1">
                <label htmlFor="nom-complet" className={etiquette}>
                  Nom complet
                </label>
                <div className={controle}>
                  <User
                    className="h-4 w-4 shrink-0 text-[#8a938f]"
                    aria-hidden="true"
                  />
                  <input
                    id="nom-complet"
                    type="text"
                    autoComplete="name"
                    className={champ}
                    placeholder="Votre nom et prénom"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    required
                  />
                </div>
              </div>

              {/* L'API authentifie sur le téléphone : un champ `type="email"`
                  rejetait le format `+24206...` avant même l'envoi. */}
              <div className="flex flex-col gap-1">
                <label htmlFor="telephone" className={etiquette}>
                  Téléphone
                </label>
                <div className={controle}>
                  <Smartphone
                    className="h-4 w-4 shrink-0 text-[#8a938f]"
                    aria-hidden="true"
                  />
                  <input
                    id="telephone"
                    type="tel"
                    autoComplete="tel"
                    className={champ}
                    placeholder="+242 06 00 00 00"
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value);
                    }}
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label htmlFor="email" className={etiquette}>
                  Email
                </label>
                <div className={controle}>
                  <Mail
                    className="h-4 w-4 shrink-0 text-[#8a938f]"
                    aria-hidden="true"
                  />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    className={champ}
                    placeholder="Facultatif"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                  />
                </div>
              </div>

              <PasswordInput
                label="Mot de passe"
                value={password}
                onChange={setPassword}
                placeholder="8 caractères min."
              />

              <PasswordInput
                label="Confirmation"
                value={confirmPassword}
                onChange={setConfirmPassword}
                placeholder="Confirmer"
              />

              {/* Le code d'accès est ce qui rattache le compte au dossier de
                  l'enfant : sans lui, le backend refuse l'inscription. */}
              <div className="col-span-2 flex flex-col gap-1">
                <label htmlFor="code-acces" className={etiquette}>
                  Code d'accès
                </label>
                <div className={controle}>
                  <KeyRound
                    className="h-4 w-4 shrink-0 text-[#8a938f]"
                    aria-hidden="true"
                  />
                  <input
                    id="code-acces"
                    type="text"
                    className={champ}
                    placeholder="Code reçu de l'établissement"
                    value={codeOtp}
                    onChange={(e) => {
                      setCodeOtp(e.target.value);
                    }}
                    required
                  />
                </div>
              </div>
            </div>

            {/* Checkbox */}
            <label className="inline-flex w-fit cursor-pointer select-none items-center gap-2 text-[12px] font-medium text-muted-foreground">
              <input
                type="checkbox"
                checked={cgu}
                onChange={(e) => setCgu(e.target.checked)}
                className="h-3.5 w-3.5 accent-primary"
              />
              J'accepte les conditions générales d'utilisation
            </label>

            <CustomButton
              className="w-full py-2.5"
              isLoading={isLoading}
              icon={<ArrowRight />}
              disabled={isLoading}
            >
              Créer mon compte
            </CustomButton>

            {message && (
              <div
                role="alert"
                className="rounded-[10px] border border-[#E53935]/40 bg-[#FDECEA] px-3 py-2 text-[13px] text-[#E53935]"
              >
                {message}
              </div>
            )}
          </form>

          <p className="mt-3 rounded-[10px] bg-secondary p-2 text-center text-[11px] leading-relaxed text-muted-foreground">
            Le code d'accès vous est remis par l'établissement.
          </p>
        </article>

        <p className="mt-3 text-center text-xs text-white/85">
          Déjà un compte ?{" "}
          <Link
            to="/login"
            className="font-semibold text-white underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Signup;
