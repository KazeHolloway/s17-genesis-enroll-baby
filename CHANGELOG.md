# Journal des modifications

Tous les changements notables d'Enroll Baby sont notés dans ce fichier.

Le format s'inspire de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/). Chaque entrée indique le numéro de la Pull Request (PR) et l'auteur.

Auteurs : **Kaze** (Kaze Holloway) et **Dorcasse** (Benicia, Benicia264) pour le backend, **Aristote** (BABA Aristote Cleven), **Valor** (valorjeannelle, Blackblacky), **Rolvi** (Luca-Mikolo) et **Val** (Val Pedro) pour le frontend.

## [Non publié]

### Du 4 au 6 octobre 2026 (finalisation)

#### Ajouté
- Page d'enregistrement du nouveau-né et des parents (PR #22, Valor)
- Pages de connexion et d'inscription (Val)
- Composant de compte à rebours de la déclaration de naissance (US-04) (PR #23, Rolvi)
- Interface des rendez-vous de suivi et de la confirmation du statut vaccinal (PR #24, Aristote)
- Mode clair et mode sombre avec bascule de thème, et amélioration de l'affichage mobile (PR #24, Aristote)
- Tableaux de bord parent et agent (PR #26 et #30, Aristote)
- Contexte d'authentification et gestion de la session de l'utilisateur, redirection vers le bon tableau de bord, inscription du parent depuis le formulaire (PR #32, Aristote)
- Liste des nouveau-nés et début du dossier de l'enfant (PR #33, Valor)
- Logger HTTP `morgan` pour tracer les requêtes (PR #25, Dorcasse)
- En-têtes de sécurité `helmet` contre l'injection XSS, le clickjacking et le sniffing (PR #27, Dorcasse)
- Limitation des tentatives de connexion et d'inscription (PR #28, Dorcasse)
- Route `GET /api/etablissements` : liste des établissements actifs

#### Modifié
- Limitation des tentatives affinée : seuls les échecs sont comptés et l'espace parent a un quota large, pour ne plus bloquer un parent qui navigue
- Documentation de l'API : ajout de la route des établissements et du code d'erreur 429 (`BACKEND-API.md`)
- Répartition des tâches, stack technique et structure du projet mises à jour dans le README

#### Corrigé
- Erreurs de types et de gestion d'erreur dans `CreationBaby.tsx` (PR #29 et #31, Kaze)
- Types du formulaire d'enregistrement perdus lors d'une fusion de branches (PR #31, Kaze)
- Création du dossier et affichage de la liste et du dossier des enfants, avec une couche d'appels API commune `http.ts` (PR #34, Dorcasse)
- Simplification de la gestion des erreurs de l'API et retrait du lien vers le site public dans la barre latérale (PR #30, Aristote)

### Jour 7 (4 octobre 2026)

#### Corrigé
- Démarrage du serveur : retrait des imports de routes inexistantes dans `app.js`, correction du nom du contrôleur de rendez-vous (`rendezVousController.js`) et import des fonctions de doublon et d'enregistrement dans le contrôleur enfant (PR #19, Kaze)

### Jour 6 (3 octobre 2026)

#### Ajouté
- Déclaration de naissance imprimable et certificat numérique public (US-03) (PR #18, Kaze)
- Compte à rebours de la déclaration J+30 (US-04) (PR #18, Dorcasse)
- Confirmation d'un vaccin administré (US-09) (PR #18, Dorcasse)
- Utilitaire de validation de date (PR #18, Kaze)
- Rendez-vous de suivi et rappel 24 h avant (US-12) (PR #17, Dorcasse)
- Statistiques de natalité et de mortalité de l'établissement (US-13) (PR #16, Kaze)
- Rappels dans l'espace parent (US-06) (PR #15, Dorcasse)
- Espace parent léger et dossier imprimable (US-07, US-08) (PR #15, Kaze)
- Calendrier vaccinal paramétrable avec calcul des échéances, inscription du parent avec le code d'accès, connexion et profil (US-05, US-10, US-11) (PR #14, Kaze)
- Agent de maternité et administrateur de test dans le seed (Kaze)

#### Corrigé
- Encodage UTF-8 forcé dans le seed pour conserver les accents (Kaze)

### Jour 5 (2 octobre 2026)

#### Ajouté
- Modèle, contrôleur et routes de l'enfant : enregistrement du nouveau-né et des parents (US-01) (PR #4, #5, #6, Dorcasse)
- Middleware d'authentification avec JSON Web Token (PR #7, Dorcasse)
- Modèle, contrôleur et routes du dossier du nouveau-né (US-02) (PR #10, #11, #12, Dorcasse et Kaze)
- Schéma SQL et seed de la base de données (Kaze)

#### Modifié
- Ancien dump SQL archivé dans `database/archive` (PR #13, Kaze)
- Gabarit d'environnement renommé en `.env.example`, avec les variables attendues (PR #13, Kaze)
- Structure du projet mise à jour dans le README (Kaze)

#### Corrigé
- Prise en compte du statut vital de l'enfant à l'enregistrement (PR #8, Dorcasse et Kaze)
- Décalage entre colonnes et valeurs à l'insertion d'un nouveau-né (Kaze)
- Décalage d'un jour sur les dates renvoyées par l'API (Kaze)

#### Supprimé
- Dépendance `mongoose` inutilisée (Kaze)

### Jours 3 et 4 (29 septembre au 1er octobre 2026)

#### Ajouté
- README initial du projet (Kaze)
- Structure fullstack en npm workspaces : frontend React, Vite et TypeScript, backend Node et Express (PR #1, #3, Kaze)