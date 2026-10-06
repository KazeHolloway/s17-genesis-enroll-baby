import CustomButton from "../components/ui/CustomButton";
import { ArrowRight } from "lucide-react";
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
    <section className="bg-login min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full relative max-w-xl min-h-225 backdrop-blur-sm flex flex-col justify-center items-center gap-8 p-8 md:p-12 rounded-2xl shadow-xl border border-primary/10">
        <div>
          <img src={logo} alt="" width={100} height={10} />
        </div>
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="headline-xl-mobile md:headline-xl text-primary">
            Se Connecter
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Pour accéder à votre espace personnel et recevoir les rappels de
            vaccination
          </p>
        </div>

        <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
          {/* Inputs */}

          {/* L'API authentifie sur le téléphone (`POST /auth/login` attend
              `telephone`), pas sur une adresse mail : un `type="email"`
              rejetait le format `+24206...` avant même l'envoi. */}
          <div className="form-group">
            <label className="text-sm font-medium text-primary">
              Numéro de téléphone
            </label>
            <input
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

          <CustomButton
            className="w-full py-3 mt-2"
            isLoading={isLoading}
            icon={<ArrowRight />}
            disabled={isLoading}
          >
            Me Connecter
          </CustomButton>

          <div className="text-accent rounded-xl p-2 font-semibold">
            {message}
          </div>
        </form>

        {/* Footer link */}
        <p className="text-sm text-muted-foreground">
          Pas de compte ?{" "}
          <Link
            to="/signup"
            className="text-primary font-semibold hover:underline"
          >
            Creer un compte
          </Link>
        </p>

        </div>
    </section>
  );
};

export default Login;
