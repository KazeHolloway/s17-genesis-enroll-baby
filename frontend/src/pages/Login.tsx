import CustomButton from "../components/ui/CustomButton";
import { ArrowLeft, ArrowRight, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthForm } from "../hooks/useAuthForm";
import { PasswordInput } from "../components/ui/auth/PasswordInput";
import { useAuth } from "@/contexts/useAuth";
import { routePourRole } from "@/lib/dashboard/routes";
import { ApiError } from "@/services/api";
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

const Login = () => {
const {
    phone,
    setPhone,
    password,
    setPassword,
    isLoading,
    setIsLoading,
    message,
    setMessage,
  } = useAuthForm();

  /* Connexion réelle via le contexte : `connexion` appelle `POST /auth/login`,
     stocke le token dans le localStorage puis navigue vers le tableau de bord du
     rôle. Sans ce branchement, le token n'est jamais écrit et toutes les routes
     protégées répondent 401 « Authentification requise ». */
  const { connexion } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (!phone || !password) {
      setMessage("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    setMessage("Connexion en cours...");

    try {
      /* Le rôle est lu depuis la réponse de l'API, pas choisi dans le
         formulaire : il n'y a qu'un seul compte par téléphone, la redirection
         se déduit donc du rôle réellement associé. */
      const utilisateur = await connexion(phone.trim(), password);

      setMessage("Connexion réussie !");
      /* Redirection par rôle : `/parent/dashboard` ou `/agent/dashboard`.
         `routePourRole` remplace l'ancienne cible `/dashboard`, unique pour
         les deux rôles, qui ne pouvait pas savoir qui s'est connecté. */
      navigate(routePourRole(utilisateur.role), { replace: true });
    } catch (error) {
      /* Le message du backend est en français et explicite (« Identifiants
         incorrects », « Compte désactivé… ») : inutile d'en fabriquer un. */
      setMessage(
        error instanceof ApiError ? error.message : "Connexion impossible.",
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
            <h1 className="text-lg font-bold text-primary">Se connecter</h1>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Recevez les rappels de vaccination de votre enfant
            </p>
          </header>

          <form className="flex flex-col gap-2.5" onSubmit={handleSubmit}>
            {/* L'API authentifie sur le téléphone (`POST /auth/login` attend
                `telephone`) : le champ reste `type="tel"` malgré le libellé. */}
            <div className="flex flex-col gap-1">
              <label htmlFor="identifiant" className={etiquette}>
                Email ou numéro de téléphone
              </label>
              <div className={controle}>
                <User
                  className="h-4 w-4 shrink-0 text-[#8a938f]"
                  aria-hidden="true"
                />
                <input
                  id="identifiant"
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

            <PasswordInput
              label="Mot de passe"
              value={password}
              onChange={setPassword}
              placeholder="Votre mot de passe"
            />

            {/* Visuel uniquement : aucune persistance (voir `handleSubmit`). */}
            <label className="inline-flex w-fit cursor-pointer select-none items-center gap-2 text-[12px] font-medium text-muted-foreground">
              <input
                type="checkbox"
                className="h-3.5 w-3.5 accent-primary"
              />
              Se souvenir de moi
            </label>

            <CustomButton
              className="w-full py-2.5"
              isLoading={isLoading}
              icon={<ArrowRight />}
              disabled={isLoading}
            >
              Se connecter
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
            Utilisez les identifiants fournis par l'établissement.
          </p>
        </article>

        <p className="mt-3 text-center text-xs text-white/85">
          Vous n'avez pas de compte ?{" "}
          <Link
            to="/signup"
            className="font-semibold text-white underline"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
