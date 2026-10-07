import type { AgentUser } from "../types/dashboard";

/**
 * Comptes agents de démonstration : le backend n'expose aucun endpoint
 * CRUD `/api/agents` (ni liste, ni création), donc la console s'appuie sur
 * cet état local tant que l'API n'existe pas.
 */
export const AGENTS_DEMO: AgentUser[] = [
  {
    id: "agent-demo-1",
    nom: "Dr. Sophie Mampouya",
    email: "sophie.mampouya@sante.cg",
    telephone: "+242 06 421 18 90",
    role: "Sage-femme",
    etablissement: "Maternité Centrale de Brazzaville",
    matricule: "SF-BZV-2026-14",
    ville: "Brazzaville",
    service: "Maternité & Néonatologie",
    actif: true,
    dateCreation: "12/01/2026",
  },
  {
    id: "agent-demo-2",
    nom: "M. Aimé Ngouala",
    email: "aime.ngouala@mairie.cg",
    telephone: "+242 06 512 77 04",
    role: "Officier État Civil",
    etablissement: "Mairie de 6e Arrondissement",
    matricule: "OEC-BZV-2026-07",
    ville: "Brazzaville",
    service: "État Civil",
    actif: true,
    dateCreation: "03/02/2026",
  },
  {
    id: "agent-demo-3",
    nom: "Dr. Patrick Mouyabi",
    email: "patrick.mouyabi@sante.cg",
    telephone: "+242 06 690 45 12",
    role: "Médecin Chef",
    etablissement: "CHU de Brazzaville",
    matricule: "MC-BZV-2026-03",
    ville: "Brazzaville",
    service: "Chirurgie pédiatrique",
    actif: false,
    dateCreation: "21/02/2026",
  },
];
