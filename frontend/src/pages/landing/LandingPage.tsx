import { Link } from "react-router-dom";
import { Accessibility, ArrowRight, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { FAQList } from "@/components/landing/FAQList";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { advantages, highlights, steps } from "@/lib/landingContent";
import enrollHero from "@/assets/enroll-hero.jpg";
import babyHand from "@/assets/baby-hand.jpg";

export default function LandingPage() {
  return (
    <div className="landing-root">
      <SiteHeader />

      <main>
        <section className="home-hero">
          <img
            className="hero-background"
            src={enrollHero}
            alt=""
            aria-hidden="true"
            loading="eager"
            fetchPriority="high"
          />
          <div className="site-container hero-inner">
            <div className="hero-copy">
              <p className="eyebrow">Plateforme numérique</p>
              <h1>
                Le dossier de votre <em>nouveau-né</em>, <br /> de la maternité à
                l'état civil
              </h1>
              <p className="hero-description">
                Déclaration, carnet de santé, vaccinations : retrouvez les
                informations et les prochaines démarches de votre enfant au même
                endroit.
              </p>
              <div className="hero-actions">
                <Button asChild variant="brandOutline" size="lg">
                  <Link to="/signup">Créer le dossier de mon enfant</Link>
                </Button>
                <Button asChild variant="brand" size="lg">
                  <Link to="/login">
                    J'ai déjà un compte
                    <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
              <div className="hero-highlights">
                {highlights.map(({ icon: Icon, title, subtitle }) => (
                  <div key={title}>
                    <span className="icon-disc">
                      <Icon aria-hidden="true" />
                    </span>
                    <p>
                      {title}
                      <br />
                      <strong>{subtitle}</strong>
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <p className="hero-note">
              Simplifiez
              <br />
              vos démarches
              <svg
                width="62"
                height="36"
                viewBox="0 0 62 36"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M2 4c14 2 30 10 44 22m0 0-3-13m3 13-13-2"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </p>
          </div>
        </section>

        <section className="overview-section" id="fonctionnalites">
          <div className="site-container overview-grid">
            <div className="advantages-block">
              <p className="eyebrow">Ce que vous gagnez</p>
              <h2>Tout ce qu'il faut, sans les allers-retours.</h2>
              <p className="section-intro">
                Aujourd'hui, suivre la santé et l'identité de son enfant suppose
                de naviguer entre plusieurs interlocuteurs et de nombreux
                justificatifs. <br className="desktop-break" />
                Enroll Baby rassemble ces informations dans un dossier unique,
                accessible au parent.
              </p>
              <div className="advantage-grid">
                {advantages.map(({ icon: Icon, title, text }) => (
                  <article className="advantage" key={title}>
                    <span className="icon-disc">
                      <Icon aria-hidden="true" />
                    </span>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </article>
                ))}
              </div>
            </div>

            <figure className="promise-photo">
              <img
                src={babyHand}
                alt="La main d'un bébé"
                loading="lazy"
              />
              <figcaption>
                Un dossier unique,
                <br />
                tout au long de
                <br />
                son parcours.
                <svg
                  width="34"
                  height="42"
                  viewBox="0 0 34 42"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M17 2v38M4 22h26M9 14l8 8 8-8M9 30l8-8 8 8"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </figcaption>
            </figure>

            <div className="faq-preview">
              <p className="eyebrow">Questions fréquentes</p>
              <h2>Les réponses à vos questions</h2>
              <p>Tout ce qu'il faut savoir avant de commencer.</p>
              <FAQList compact />
              <Link className="text-link" to="/login">
                Voir toutes les questions
              </Link>
            </div>
          </div>
        </section>

        <section className="journey-section" id="parcours">
          <div className="site-container">
            <p className="eyebrow">Comment ça marche ?</p>
            <h2>Un parcours en cinq étapes</h2>
            <div className="steps-grid">
              {steps.map(([title, text], i) => (
                <article key={title}>
                  <span className="step-number">0{i + 1}</span>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="parent-section" id="parents">
          <div className="site-container parent-grid">
            <div>
              <p className="eyebrow">Pensé pour les parents</p>
              <h2>Moins de paperasse. Plus de temps avec votre enfant.</h2>
              <p>
                Vous ne rememberz plus quel papier exige le Delay pour l'état
                civil, ni quel carnet!... Le dossier réunit l'essentiel à un
                seul endroit.
              </p>
              <p>
                Vous retrouvez, en quelques secondes, la déclaration de
                naissance, le calendrier vaccinal et les prochaines échéances.
              </p>
              <p className="small-note">
                Pas de smartphone ? Le parcours papier reste disponible.
              </p>
              <Button asChild variant="brand" size="lg">
                <Link to="/signup">
                  Créer le dossier de mon enfant
                  <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
            <div className="accessibility-block">
              <span className="paper-symbol" aria-hidden="true">
                ❧
              </span>
              <h3>Un dossier pensé pour tous</h3>
              <p>
                Conçu pour être compris, utilisable au quotidien et accessible
                aussi aux personnes en situation de handicap.
              </p>
              <p className="small-note">
                L'accessibilité n'est pas une option. C'est une condition.
              </p>
            </div>
          </div>
        </section>

        <section className="security-section">
          <div className="site-container security-inner">
            <ShieldCheck size={44} aria-hidden="true" />
            <div>
              <h2>Vos données, notre engagement</h2>
              <p>
                Le dossier de votre enfant contient des données sensibles.
                Elles sont traitées avec la plus grande rigueur.
              </p>
              <ul className="security-points">
                <li>
                  <ShieldCheck size={14} aria-hidden="true" />
                  Hébergement en France
                </li>
                <li>
                  <Accessibility size={14} aria-hidden="true" />
                  Conception accessible
                </li>
                <li>
                  <ShieldCheck size={14} aria-hidden="true" />
                  Accès réservé aux parents
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="final-cta">
          <div className="site-container">
            <p className="eyebrow">Prêt à commencer ?</p>
            <h2>Un dossier simple, dès aujourd'hui.</h2>
            <p>
              Créez le dossier de votre enfant et retrouvez toutes les
              démarches au même endroit.
            </p>
            <Button asChild variant="brand" size="lg">
              <Link to="/signup">
                Créer le dossier de mon enfant
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}