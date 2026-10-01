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
  - [Prérequis](#prérequis)
  - [Installation](#installation)
  - [Démarrage en Développement](#démarrage-en-développement)
    - [1. Lancer le Front et le Back en simultané (Recommandé)](#1-lancer-le-front-et-le-back-en-simultané-recommandé)
    - [2. Lancer uniquement le Backend](#2-lancer-uniquement-le-backend)
    - [3. Lancer uniquement le Frontend](#3-lancer-uniquement-le-frontend)
  - [Gestion des Dépendances (npm Workspaces)](#gestion-des-dépendances-npm-workspaces)
  - [Build / Production](#build--production)
  - [Bonnes Pratiques de Contribution](#bonnes-pratiques-de-contribution)
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
│   │   ├── database/
│   │   │   └── Base_de_donnees.sql
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
│   │   │   ├── react.svg
│   │   │   └── vite.svg
│   │   │
│   │   ├── components/
│   │   │
│   │   ├── lib/
│   │   │   └── types.ts
│   │   │
│   │   ├── pages/
│   │   │
│   │   ├── services/
│   │   │   └── api.ts
│   │   │
│   │   ├── App.css
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── tsconfig.app.json
│   ├── tsconfig.json
│   ├── tsconfig.node.json
│   └── vite.config.ts
│
├── .gitignore
├── package-lock.json
├── package.json
└── README.md
```

## Prérequis

Assurez-vous d'avoir installé sur votre machine :

- **Node.js** : `v18.x` ou supérieur (recommandé : `v20.x`)
- **npm** : `v9.x` ou supérieur (fourni avec Node.js)
- **Git**

---

## Installation

1. **Cloner le projet :**

   ```bash
   git clone <URL_DU_REPO_GITHUB>
   cd anroll-baby
   ```

2. **Installer toutes les dépendances (Front + Back) en une seule commande :**
   À la racine du projet, lancez :

   ```bash
   npm install
   ```

   > _Grâce aux Workspaces npm, cette commande installe automatiquement les dépendances de la racine, de `frontend/` et de `backend/` dans le dossier `node_modules` principal._

3. **Configurer les variables d'environnement :**
   - Créez un fichier `.env` dans le dossier `backend/` (en vous basant sur `backend/.env.example`).
   - Créez un fichier `.env` dans le dossier `frontend/` si nécessaire.

---

---

## Démarrage en Développement

Pour travailler sereinement, vous avez plusieurs options :

### 1. Lancer le Front et le Back en simultané (Recommandé)

Depuis la racine du projet :

```bash
npm run dev
```

Cette commande lance à la fois l'API Backend et le serveur Frontend React dans le même terminal via `concurrently`.

### 2. Lancer uniquement le Backend

```bash
npm run dev:back
```

_(Le serveur tourne généralement sur `http://localhost:5000`)_

### 3. Lancer uniquement le Frontend

```bash
npm run dev:front
```

_(L'application client tourne généralement sur `http://localhost:5173`)_

---

## Gestion des Dépendances (npm Workspaces)

Pour ajouter un nouveau package, il faut spécifier le workspace ciblé depuis la racine du monorepo :

- **Ajouter un paquet au Backend :**

  ```bash
  npm install <nom-du-paquet> --workspace=backend
  ```

- **Ajouter un paquet au Frontend :**

  ```bash
  npm install <nom-du-paquet> --workspace=frontend
  ```

- **Ajouter un outil de développement global (à la racine) :**

  ```bash
  npm install <nom-du-paquet> -D
  ```

---

## Build / Production

Pour compiler les projets avant un déploiement :

```bash
# Compile le frontend (Vite)
npm run build:front

# Compile le backend (si applicable)
npm run build:back
```

---

## Bonnes Pratiques de Contribution

1. **Branches Git :** Créez une branche par fonctionnalité en respectant le nommage :
   - Ex: `feature/US-01-enregistrement-enfant`
   - Ex: `fix/US-04-compte-a-rebours`
2. **Commits :** Faites des commits clairs et explicites.
3. **Pull Requests :** Soumettez votre PR vers `develop` pour relecture avant fusion.


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