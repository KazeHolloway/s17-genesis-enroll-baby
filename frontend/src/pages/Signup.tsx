import CustomButton from "../components/ui/CustomButton";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthForm } from "../hooks/useAuthForm";
import { PasswordInput } from "../components/ui/auth/PasswordInput";
import logo from "../assets/logo.png";
import { register } from "../services/api";

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
    cgu,
    setCgu,
    isLoading,
    setIsLoading,
    message,
    setMessage,
    codeOtp,
    setCodeOtp,
    reset,
  } = useAuthForm();

  const handleSubmit = async (
    e: React.SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    if (!name || !phone || !password) {
      setMessage("Veuillez remplir tous les champs");
      return;
    }
    if (!cgu) {
      setMessage("Veuillez cocher la case des CGU");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("Les deux mots de passes doivent etre identiques");
      return;
    }

    setIsLoading(true);
    setMessage("Enregistrement en cours...");

    try {
      await register({
        code_acces: codeOtp,
        nom: name,
        telephone: phone,
        email,
        mot_de_passe: password,
      });
      setMessage("Enregistrement réussi !");
      reset();
      // navigate("/dashboard");
    } catch (err) {
      setMessage(
        err instanceof Error ? err.message : "Une erreur est survenue",
      );
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <section className="bg-login min-h-screen w-full flex items-center justify-center p-4">
      <div className="w-full max-w-xl min-h-225 backdrop-blur-sm flex flex-col justify-center items-center gap-8 p-8 md:p-12 rounded-2xl shadow-xl border border-primary/10">
        <div>
          <img src={logo} alt="" width={100} height={10} />
        </div>
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="headline-xl-mobile md:headline-xl text-primary">
            Créer un compte
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            Pour accéder à votre espace personnel et recevoir les rappels de
            vaccination
          </p>
        </div>

        <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
          {/* Inputs */}
          <div className="form-group">
            <label className="text-sm font-medium text-primary">
              Nom Complet
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-primary/20 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              placeholder="Votre nom et prénom"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              required
            />
          </div>

          <div className="form-group">
            <label className="text-sm font-medium text-primary">
              Numero de telephone
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-primary/20 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              placeholder="Ex: 242 06 600 00 00"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
              }}
              required
            />
          </div>

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
          <div className="form-group">
            <label className="text-sm font-medium text-primary">Code OTP</label>
            <input
              type="text"
              className="w-full rounded-lg border border-primary/20 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              placeholder="Votre acode OTP"
              value={codeOtp}
              onChange={(e) => {
                setCodeOtp(e.target.value);
              }}
              required
            />
          </div>

          {/* Checkbox */}
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

        {/* Footer link */}
        <p className="text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <Link
            to="/login"
            className="text-primary font-semibold hover:underline"
          >
            Se connecter
          </Link>
        </p>
      </div>
    </section>
  );
};

export default Signup;
