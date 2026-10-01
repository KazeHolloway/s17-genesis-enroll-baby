# Enroll-Baby

Plateforme permettant de créer et suivre le dossier d'un nouveau-né dès sa naissance, tout en facilitant les échanges entre les parents, l'établissement de santé et l'état civil. Projet réalisé en semaine 17 (S17, dans le cadre de la formation à Akieni Academy, Cohorte 2) : de la conception du produit jusqu'à une première version fonctionnelle du MVP.

**Démo en ligne : [le lien sera ajouté après le déploiement]**

## Sommaire

- [Enroll-Baby](#enroll-baby)
  - [Sommaire](#sommaire)
  - [À propos](#à-propos)
  - [Simulation et périmètre](#simulation-et-périmètre)
  - [Fonctionnalités](#fonctionnalités)
    - [Espace parents](#espace-parents)
    - [Espace établissement de santé](#espace-établissement-de-santé)
    - [Espace état civil](#espace-état-civil)
    - [Ensemble du site](#ensemble-du-site)
  - [Public visé](#public-visé)
  - [Stack technique](#stack-technique)
  - [Structure du projet](#structure-du-projet)
  - [Installation locale](#installation-locale)
  - [Déploiement](#déploiement)
  - [Comment utiliser](#comment-utiliser)
  - [Organisation de la Squad 6 - Genesis](#organisation-de-la-squad-6---genesis)
  - [Répartition des tâches et avancement de l'équipe FullStack](#répartition-des-tâches-et-avancement-de-léquipe-fullstack)
  - [Résultats du projet](#résultats-du-projet)
  - [Liens](#liens)

## À propos

À la naissance d'un enfant, les parents doivent aujourd'hui multiplier les déplacements entre l'hôpital et la mairie pour déclarer leur enfant, et n'ont souvent aucun moyen simple de suivre son dossier de santé (vaccinations, rendez-vous) une fois rentrés chez eux. Enroll-Baby centralise ce suivi : l'enregistrement du nouveau-né, la transmission des informations nécessaires à l'état civil, et le suivi du carnet de vaccination avec des rappels pour les parents.

## Simulation et périmètre

Enroll-Baby est construit comme si l'établissement de santé et l'état civil étaient des acteurs connectés à la plateforme, avec leurs propres espaces dans l'application. Aucune intégration avec un vrai système hospitalier ou une vraie mairie n'a été mise en place : c'est un choix assumé. Le numérique ne remplace pas les démarches physiques existantes : une personne sans accès à l'application peut toujours procéder de façon classique.

## Fonctionnalités

*(à compléter au fil du sprint, une fois le backlog du BA disponible*

### Espace parents
- [ ]

### Espace établissement de santé
- [ ]

### Espace état civil
- [ ]

### Ensemble du site
- [ ]

## Public visé

*(à préciser avec le PM : parents, personnel de santé, agents d'état civil)*

## Stack technique

- ReactJS (Vite)
- Node.js / Express (API REST)
- PostgreSQL

## Structure du projet

```
s17-genesis-enroll-baby/
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │
│   │   ├── controllers/
│   │   │
│   │   ├── middlewares/
│   │   │
│   │   ├── routes/
│   │   │
│   │   ├── utils/
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── package-lock.json
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   │
│   ├── src/
│   │   ├── assets/
│   │   │   ├── hero.png
│   │   │   └── vite.svg
│   │   │
│   │   ├── components/
│   │   │
│   │   ├── pages/
│   │   │   └── creation-compte-parent/
│   │   │       ├── CreationCompteParent.css
│   │   │       └── CreationCompteParent.jsx
│   │   │
│   │   ├── styles/
│   │   │   └── global.css
│   │   │
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   │
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
└── README.md
```

## Installation locale

```bash
git clone https://github.com/KazeHolloway/s17-genesis-enroll-baby.git
cd s17-genesis-enroll-baby
```

**Frontend**

```bash
cd frontend
npm install
npm run dev
```

L'application démarre sur `http://localhost:5173`.

**Backend**

```bash
cd backend
npm install
npm run dev
```

L'API démarre sur `http://localhost:3000`.

## Déploiement

*(à compléter une fois la plateforme d'hébergement choisie)*

## Comment utiliser

*(à compléter une fois les premières pages fonctionnelles : parcours type d'un parent, d'un agent de santé, etc.)*

## Organisation de la Squad 6 - Genesis

| Rôle | Nom |
|---|---|
| **Product Manager** | Brege NGOULOU |
| **Business Analyst** | Mircelia Théolinda KOUTCHIKA |
| **Business Analyst** | Wisdom Fortuné PENZAMOY OWORO |
| **Repo Admin & Développeur Fullstack** | Christophe Darly MASSAMBA BOUESSO |
| **Lead & Développeuse Fullstack** | Dorcasse Benicia MOUSSANA |
| **Développeur Fullstack** | Aristote BABA |
| **Développeur Fullstack** | Rolvi MIKOLO |
| **Développeur Fullstack** | Val Clancy PEDRO |
| **Développeuse Fullstack** | Brichelvie Jeannelle OWALA |

## Répartition des tâches et avancement de l'équipe FullStack

| Dev | Page(s) | Statut |
|---|---|---|
| Christophe Darly MASSAMBA BOUESSO | | |
| Dorcasse Benicia MOUSSANA | | |
| Aristote BABA | | |
| Rolvi MIKOLO | | |
| Val Clancy PEDRO | | |
| Brichelvie Jeannelle OWALA | | |

## Résultats du projet

*(à compléter en fin de sprint : fonctionnalités livrées, tests, démonstration)*

## Liens

- [Lien vers le repository](https://github.com/KazeHolloway/s17-genesis-enroll-baby)