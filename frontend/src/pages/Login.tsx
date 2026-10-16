import CustomButton from "../components/ui/CustomButton";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthForm } from "../hooks/useAuthForm";
import { PasswordInput } from "../components/ui/auth/PasswordInput";
import logo from "../assets/logo.png";

const Login = () => {
  const {
    role,
    setRole,
    email,
    setEmail,
    password,
    setPassword,
    isLoading,
    setIsLoading,
    message,
    setMessage,
  } = useAuthForm();

  // Handlesubmit
  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!email || !password) {
      setMessage("Veuillez remplir et cochez tous les champs");
      return;
    }
    setIsLoading(true);
    setMessage("Connexion en cours...");
    // TODO: call your API here
    // await fetch(...)
    setIsLoading(false);
    setMessage("Connexion réussie !");
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

        {/* Role toggle */}
        <div className="flex rounded-lg border border-primary/20 overflow-hidden">
          <CustomButton
            className="flex-1 rounded-none border-0"
            variant={role === "parent" ? "tab-active" : "tab"}
            onClick={() => setRole("parent")}
          >
            Parent
          </CustomButton>
          <CustomButton
            type="button"
            variant={role === "professionnel" ? "tab-active" : "tab"}
            className="flex-1 rounded-none border-0"
            onClick={() => setRole("professionnel")}
          >
            Professionnel de Santé
          </CustomButton>
        </div>

        <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
          {/* Inputs */}

          <div className="form-group">
            <label className="text-sm font-medium text-primary">Email</label>
            <input
              type="email"
              className="w-full rounded-lg border border-primary/20 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              placeholder="Votre adresse mail"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
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

        <div>
          <p>{email}</p>
          <p>{password}</p>
        </div>
      </div>
    </section>
  );
};

export default Login;
