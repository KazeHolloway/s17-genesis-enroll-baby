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


### Espace parents
- [x] Créer son compte à partir du code d'accès remis à la maternité
- [x] Se connecter
- [x] Consulter le calendrier vaccinal de son enfant
- [x] Consulter son espace parent (informations essentielles, déclaration, prochaine démarche)
- [x] Voir les rappels des échéances de son enfant
- [x] Suivre le compte à rebours de 30 jours pour la déclaration de naissance
- [x] Consulter la déclaration imprimable et le certificat numérique de son enfant

### Espace établissement de santé
- [x] Générer le dossier imprimable du nouveau-né
- [x] Consulter les statistiques de natalité et de mortalité de l'établissement
- [x] Confirmer l'administration d'un vaccin
- [x] Générer le code d'accès remis au parent
- [x] Enregistrer les parents d'un nouveau-né
- [x] Enregistrer un nouveau-né depuis l'interface
- [x] Consulter la liste des nouveau-nés et ouvrir le dossier d'un enfant
- [x] Planifier, modifier ou annuler un rendez-vous de suivi (rappel 24 h avant pour le parent)

### Espace état civil
La mairie n'est pas connectée à la plateforme dans le MVP : le parent présente la déclaration imprimée et son numéro de dossier.

### Ensemble du site
- [x] Page d'accueil avec foire aux questions
- [x] Mode clair et mode sombre
- [x] Affichage adapté aux mobiles (responsive)
- [x] Tableaux de bord distincts pour le parent et l'agent de maternité

## Public visé

Le produit s'adresse à quatre profils :

- **Les parents** d'un nouveau-né (cible principale), avec un smartphone d'entrée de gamme.
- **Les parents sans smartphone ou sans internet**, qui utilisent le dossier papier imprimé par la maternité.
- **Les agents de maternité** (sages-femmes), qui enregistrent l'enfant et ses parents une seule fois.
- **Les responsables d'établissement**, qui consultent les statistiques de natalité et de mortalité.

## Stack technique

- ReactJS (Vite) avec TypeScript et Tailwind CSS
- Node.js / Express (API REST), authentification par JWT
- Sécurité et suivi : helmet (en-têtes de sécurité), express-rate-limit (limitation des tentatives), morgan (journal des requêtes)
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
│   │   │   ├── archive/
│   │   │   │   └── Base_de_donnees.sql
│   │   │   ├── schema.sql
│   │   │   └── seed.sql
│   │   │
│   │   ├── middlewares/
│   │   │   ├── auth.js
│   │   │   └── rateLimit.js
│   │   │
│   │   ├── models/
│   │   │
│   │   ├── routes/
│   │   │
│   │   ├── utils/
│   │   │
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── .env.example
│   ├── BACKEND-API.md
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
│   │   ├── contexts/
│   │   │   ├── AuthContext.tsx
│   │   │   └── ThemeContext.tsx
│   │   │
│   │   ├── hooks/
│   │   │
│   │   ├── layouts/
│   │   │
│   │   ├── lib/
│   │   │   ├── dashboard/
│   │   │   └── types.ts
│   │   │
│   │   ├── pages/
│   │   │
│   │   ├── services/
│   │   │   ├── api.ts
│   │   │   └── http.ts
│   │   │
│   │   ├── styles/
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
├── CHANGELOG.md
├── CONTRIBUTING.md
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
   git clone https://github.com/KazeHolloway/s17-genesis-enroll-baby.git
   cd s17-genesis-enroll-baby
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

4. **Créer la base de données PostgreSQL avec des données de test :**

```bash
   psql -U postgres -c "CREATE DATABASE enroll_baby"
   psql -U postgres -d enroll_baby -f backend/src/database/schema.sql
   psql -U postgres -d enroll_baby -f backend/src/database/seed.sql
```

   > _Le fichier `seed.sql` s'exécute sur une base vide. Il crée un agent de maternité, un administrateur, un compte parent et quatre nouveau-nés de test (comptes et codes d'accès détaillés dans [`backend/BACKEND-API.md`](backend/BACKEND-API.md))._

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
2. **Commits :** Suivez la convention `type: description` (`feat`, `fix`, `docs`, `chore`...), en minuscules et sans accents.
3. **Pull Requests :** Soumettez votre PR vers `dev` pour relecture avant fusion. Ne poussez jamais directement sur `dev` ni sur `main`.

Le détail complet est dans [CONTRIBUTING.md](CONTRIBUTING.md).


## Comment utiliser

1. Lancer le projet avec `npm run dev` (voir la section Démarrage en Développement).
2. **Agent de maternité :** se connecter avec `+242060000001` / `Agent123!`, enregistrer un nouveau-né et ses parents, puis noter le **code d'accès** affiché (il n'est montré qu'une seule fois).
3. **Parent :** créer son compte avec ce code d'accès, puis se connecter pour voir le dossier de son enfant, le compte à rebours de 30 jours, le calendrier vaccinal et les rappels.
4. **Compte parent de test déjà prêt :** `+242061000010` / `Parent123!`.
5. **Administrateur :** `+242060000002` / `Admin123!` (statistiques de l'établissement).

La liste complète des routes de l'API est dans [`backend/BACKEND-API.md`](backend/BACKEND-API.md).

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
| Christophe Darly MASSAMBA BOUESSO | Backend : déclaration imprimable et certificat numérique (US-03), calendrier vaccinal (US-05), espace parent (US-07), dossier imprimable (US-08), compte parent (US-10), connexion (US-11), statistiques (US-13). Schéma et seed de la base, corrections du démarrage du serveur et du front, documentation et gestion du dépôt | Terminé |
| Dorcasse Benicia MOUSSANA | Backend : base du projet, enregistrement du nouveau-né et des parents (US-01), dossier du nouveau-né (US-02), compte à rebours de déclaration (US-04), rappels (US-06), confirmation d'un vaccin (US-09), rendez-vous de suivi (US-12), middleware d'authentification, middlewares morgan, helmet et limitation des tentatives. Front : corrections de l'enregistrement du nouveau-né, de la liste et du dossier des enfants | Terminé |
| Aristote BABA | Page d'accueil, mode clair et sombre, tableaux de bord parent et agent, contexte d'authentification, rendez-vous de suivi, confirmation du statut vaccinal | Intégré dans dev |
| Rolvi MIKOLO | Composant de compte à rebours de la déclaration de naissance (US-04) | Intégré dans dev |
| Val Clancy PEDRO | Pages de connexion et d'inscription | Intégré dans dev |
| Brichelvie Jeannelle OWALA | Page d'enregistrement du nouveau-né et des parents, liste des nouveau-nés, début du dossier de l'enfant | Intégré dans dev |

## Résultats du projet

*(à compléter en fin de sprint : fonctionnalités livrées, tests, démonstration)*

## Liens

- [Lien vers le repository](https://github.com/KazeHolloway/s17-genesis-enroll-baby)