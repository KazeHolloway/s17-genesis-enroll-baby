import CustomButton from "../components/ui/CustomButton";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthForm } from "../hooks/useAuthForm";
import { PasswordInput } from "../components/ui/auth/PasswordInput";
import { useAuth } from "@/contexts/useAuth";
import { routePourRole } from "@/lib/dashboard/routes";
import { ApiError } from "@/services/api";
import logo from "../assets/logo.png";

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
    <section className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#faf9f5] p-4">
      {/* Décor végétal — coin supérieur droit (pure illustration, non cliquable) */}
      <svg
        aria-hidden="true"
        viewBox="0 0 200 200"
        fill="none"
        className="pointer-events-none absolute -top-10 -right-10 h-56 w-56 text-[#1b5e52] opacity-[0.13]"
      >
        <path
          d="M196 4C150 28 118 66 104 118"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
        <path d="M170 24c-20 4-33 20-33 40 22 0 38-18 33-40z" fill="currentColor" />
        <path d="M131 61c-19 6-30 23-28 43 21-2 35-21 28-43z" fill="currentColor" />
        <path d="M186 64c-17 9-25 27-21 46 20-5 31-26 21-46z" fill="currentColor" />
        <path d="M110 104c-17 9-25 27-21 46 20-5 31-26 21-46z" fill="currentColor" />
      </svg>

      {/* Retour à la landing. `fixed` et non `absolute` : le parent est un
          conteneur `flex` sans hauteur propre, un lien en absolute se
          positionnerait par rapport à la page entière et disparaissait au
          défilement sur mobile. */}
      <div className="relative w-full max-w-[440px] rounded-[28px] border border-[#144c42]/10 bg-white p-6 sm:p-8 shadow-[0_20px_60px_-30px_rgba(16,61,52,0.45)]">
        {/* Retour à la landing, ancré dans la carte : en `fixed`, il flottait
            au-dessus du logo et sortait de la carte sur mobile. */}
        <Link
          to="/"
          className="mb-5 inline-flex w-fit min-h-[36px] items-center gap-1.5 rounded-full border border-primary/15 bg-white px-3 py-1.5 text-xs font-semibold text-primary btn-interaction hover:bg-primary/10 focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Retour
        </Link>

        <img src={logo} alt="Enroll Baby" className="mb-6 h-12 w-auto" />

        {/* Header */}
        <header className="text-left">
          <h1 className="headline-xl-mobile md:headline-xl text-primary">
            Se connecter
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Pour accéder à votre espace personnel et recevoir les rappels de
            vaccination
          </p>
        </header>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Inputs */}

          {/* L'API authentifie sur le téléphone (`POST /auth/login` attend
              `telephone`), pas sur une adresse mail : un `type="email"`
              rejetait le format `+24206...` avant même l'envoi. Le libellé
              peut promettre l'email, le champ reste `type="tel"`. */}
          <div className="form-group">
            <label htmlFor="identifiant" className="text-sm font-medium text-primary">
              Email ou numéro de téléphone
            </label>
            <input
              id="identifiant"
              type="tel"
              autoComplete="tel"
              className="w-full rounded-lg border border-primary/20 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              placeholder="+242 06 00 00 00"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              required
            />
          </div>

          <PasswordInput
            label="Mot de passe"
            value={password}
            onChange={setPassword}
            placeholder="Votre mot de passe"
          />

          {/* Visuel uniquement : aucune persistance (voir `handleSubmit`). */}
          <label className="flex w-fit cursor-pointer select-none items-center gap-2 text-sm text-muted-foreground">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-primary/30 text-primary focus:ring-primary/50"
            />
            Se souvenir de moi
          </label>

          <CustomButton
            className="w-full py-3 mt-1"
            isLoading={isLoading}
            icon={<ArrowRight />}
            disabled={isLoading}
          >
            Se connecter
          </CustomButton>

          <div className="text-accent rounded-xl p-2 font-semibold">
            {message}
          </div>
        </form>

        {/* Footer link */}
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Vous n'avez pas de compte ?{" "}
          <Link
            to="/signup"
            className="text-primary font-semibold hover:underline"
          >
            Créer un compte
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Login;
