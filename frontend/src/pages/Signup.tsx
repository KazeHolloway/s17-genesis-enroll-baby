import CustomButton from "../components/ui/CustomButton";
import { ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthForm } from "../hooks/useAuthForm";
import { PasswordInput } from "../components/ui/auth/PasswordInput";
import { inscriptionParent, ApiError } from "../services/api";
import logo from "../assets/logo.png";

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
              autoComplete="name"
              className="w-full rounded-lg border border-primary/20 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              placeholder="Votre nom et prénom"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              required
            />
          </div>

          {/* L'API authentifie sur le téléphone : un champ `type="email"`
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

          <div className="form-group">
            <label className="text-sm font-medium text-primary">Email</label>
            <input
              type="email"
              autoComplete="email"
              className="w-full rounded-lg border border-primary/20 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              placeholder="Votre adresse mail (facultatif)"
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
            placeholder="8 caractères minimum"
          />

          <PasswordInput
            label="Confirmation mot de passe"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="Confirmer le mot de passe"
          />

          {/* Le code d'accès est ce qui rattache le compte au dossier de
              l'enfant : sans lui, le backend refuse l'inscription. */}
          <div className="form-group">
            <label className="text-sm font-medium text-primary">
              Code d'accès
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-primary/20 bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition"
              placeholder="Code reçu de l'établissement"
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
