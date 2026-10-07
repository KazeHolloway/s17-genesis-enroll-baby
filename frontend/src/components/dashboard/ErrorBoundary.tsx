import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface Etat {
  erreur: Error | null;
}

/**
 * Garde-fou global : une erreur de rendu ne doit jamais laisser une page
 * blanche, laissant l'utilisateur croire que la donnée n'existe pas.
 * Affiche le message et permet de réessayer.
 */
export default class ErrorBoundary extends Component<Props, Etat> {
  state: Etat = { erreur: null };

  static getDerivedStateFromError(erreur: Error): Etat {
    return { erreur };
  }

  componentDidCatch(erreur: Error, info: ErrorInfo): void {
    console.error("Erreur non gérée :", erreur, info);
  }

  render() {
    if (this.state.erreur) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-6 text-center">
          <h1 className="font-serif text-xl font-bold text-[var(--app-heading)]">
            Une erreur est survenue
          </h1>
          <p className="max-w-md text-sm text-[var(--app-muted)]">
            {this.state.erreur.message}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ erreur: null })}
            className="app-action"
          >
            Réessayer
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}