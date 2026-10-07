import CustomButton from "../components/ui/CustomButton";
import { ArrowLeft, ArrowRight } from "lucide-react";
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
        {/* Retour à la landing, ancré dans la carte (même placement que Login). */}
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
            Créer un compte
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            Pour accéder à votre espace personnel et recevoir les rappels de
            vaccination
          </p>
        </header>

        <form className="mt-6 flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Inputs */}
          <div className="form-group">
            <label htmlFor="nom-complet" className="text-sm font-medium text-primary">
              Nom complet
            </label>
            <input
              id="nom-complet"
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
            <label htmlFor="telephone" className="text-sm font-medium text-primary">
              Numéro de téléphone
            </label>
            <input
              id="telephone"
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
            <label htmlFor="email" className="text-sm font-medium text-primary">Email</label>
            <input
              id="email"
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
            <label htmlFor="code-acces" className="text-sm font-medium text-primary">
              Code d'accès
            </label>
            <input
              id="code-acces"
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
            className="w-full py-3 mt-1"
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
        <p className="mt-6 text-center text-sm text-muted-foreground">
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
