import {
  Clock3,
  ShieldCheck,
  Smartphone,
  UsersRound,
  Landmark,
  Heart,
  FilePenLine,
  MapPin,
  LockKeyhole,
} from "lucide-react";

export const advantages = [
  {
    icon: Clock3,
    title: "Gain de temps",
    text: "Moins de démarches répétitives. Retrouvez les informations essentielles de votre enfant dans un seul espace.",
  },
  {
    icon: ShieldCheck,
    title: "Sécurité des données",
    text: "Les données de votre enfant sont traitées avec attention et dans le respect du cadre applicable à la protection des données.",
  },
  {
    icon: Smartphone,
    title: "Accessible à tous",
    text: "Une alternative papier est prévue pour les parents qui n'ont pas de smartphone ou d'accès à Internet.",
  },
  {
    icon: UsersRound,
    title: "Suivi complet",
    text: "De la naissance aux vaccinations, suivez les principales étapes et les prochaines échéances de votre enfant.",
  },
  {
    icon: Landmark,
    title: "Un parcours mieux coordonné",
    text: "Le dossier est créé dès la maternité afin de faciliter la continuité du parcours.",
  },
  {
    icon: Heart,
    title: "Pour un avenir en bonne santé",
    text: "Un accompagnement pour aider les parents à savoir, à chaque étape, quelle est la prochaine démarche à effectuer.",
  },
];

export const highlights = [
  {
    icon: FilePenLine,
    title: "Déclaration de naissance",
    subtitle: "simplifiée",
  },
  {
    icon: ShieldCheck,
    title: "Suivi vaccinal",
    subtitle: "personnalisé",
  },
  {
    icon: MapPin,
    title: "Accès au dossier",
    subtitle: "en ligne",
  },
  {
    icon: LockKeyhole,
    title: "Sécurité des données",
    subtitle: "garantie",
  },
];

export const faqs: [string, string][] = [
  [
    "Qui peut créer un compte sur Enroll Baby ?",
    "Le compte parent permet d'accéder au dossier de son enfant et de consulter les informations et échéances disponibles dans son espace personnel.",
  ],
  [
    "Quand le dossier de mon enfant est-il créé ?",
    "Le dossier est créé dès l'enregistrement du nouveau-né à la maternité.",
  ],
  [
    "Comment fonctionne le suivi vaccinal ?",
    "Le calendrier vaccinal permet de consulter les prochaines vaccinations prévues pour l'enfant et les échéances à venir.",
  ],
  [
    "Est-ce que mes données sont sécurisées ?",
    "Enroll Baby est conçu avec une attention particulière portée à la protection des données de l'enfant et de ses parents.",
  ],
  [
    "Que se passe-t-il si je n'ai pas de smartphone ou Internet ?",
    "Le parcours papier reste disponible. Le numérique complète le parcours physique, il ne le remplace pas.",
  ],
  [
    "Est-ce que je peux retrouver le dossier de mon enfant plus tard ?",
    "Oui. Une fois votre compte créé et rattaché au dossier de votre enfant, vous pouvez retrouver les informations disponibles depuis votre espace parent.",
  ],
  [
    "Le certificat numérique remplace-t-il le document officiel ?",
    "Non. Dans le MVP, la déclaration signée par la sage-femme reste le document officiel ; le certificat numérique vient la compléter.",
  ],
];

export const steps: [string, string][] = [
  [
    "À la maternité",
    "Les informations du nouveau-né et de ses parents sont enregistrées une seule fois.",
  ],
  [
    "Le dossier est créé",
    "Un dossier numérique est créé pour l'enfant, avec un accès destiné au parent.",
  ],
  [
    "Le parent crée son compte",
    "Le parent se connecte à son espace personnel pour retrouver le dossier de son enfant.",
  ],
  [
    "Les échéances sont visibles",
    "Le parent retrouve le délai de déclaration et les prochaines vaccinations.",
  ],
  [
    "Le parcours continue",
    "Le dossier reste accessible tout au long du parcours de votre enfant.",
  ],
];
