import CustomButton from "../components/ui/CustomButton";
import { ArrowRight } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuthForm } from "../hooks/useAuthForm";
import { PasswordInput } from "../components/ui/auth/PasswordInput";
import logo from "../assets/logo.png";
import { login } from "../services/api";

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
  const { pathname } = useLocation();
  const isPro = pathname.startsWith("/pro");
  const navigate = useNavigate();

  // Handlesubmit
  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (!phone || !password) {
      setMessage("Veuillez remplir et cochez tous les champs");
      return;
    }
    setIsLoading(true);
    setMessage("Connexion en cours...");
    // API Call
    try {
      await login({ phone, password });
      setMessage("Connexion réussie !");
      navigate("/dashboard");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "Une erreur est survenue",
      );
    } finally {
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
        <h1 className="headline-lg text-primary">
          {isPro ? "Espace Professionnel" : "Espace Parent"}
        </h1>
        {/* ...form... */}
        <p></p>

        <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
          {/* Inputs */}

          <div className="form-group">
            <label className="text-sm font-medium text-primary">
              Numero de telephone
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-primary/20 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              placeholder="Votre numero de telephone"
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

        {isPro ? (
          <p className="text-sm text-muted-foreground">
            Pas de compte ? <Link to="/pro/signup">Créer un compte</Link>
          </p>
        ) : (
          <p className="text-sm text-muted-foreground">
            Pas de compte ? <Link to="/signup">Créer un compte</Link>
          </p>
        )}
      </div>
    </section>
  );
};

export default Login;
