# Journal des modifications

Tous les changements notables d'Enroll Baby sont notés dans ce fichier.

Le format s'inspire de [Keep a Changelog](https://keepachangelog.com/fr/1.1.0/). Chaque entrée indique le numéro de la Pull Request (PR) et l'auteur.

Auteurs : **Kaze** (Kaze Holloway) et **Dorcasse** (Benicia, Benicia264) pour le backend.

## [Non publié]

### Jour 7 (4 octobre 2026)

#### Corrigé
- Démarrage du serveur : retrait des imports de routes inexistantes dans `app.js`, correction du nom du contrôleur de rendez-vous (`rendezVousController.js`) et import des fonctions de doublon et d'enregistrement dans le contrôleur enfant (PR #19, Kaze)

### Jour 6 (3 octobre 2026)

#### Ajouté
- Déclaration de naissance imprimable, certificat numérique public et compte à rebours J+30 (US-03, US-04) (PR #18, Kaze)
- Confirmation d'un vaccin administré (US-09) (PR #18, Kaze)
- Utilitaire de validation de date (PR #18, Kaze)
- Rendez-vous de suivi et rappel 24 h avant (US-12) (PR #17, Dorcasse)
- Statistiques de natalité et de mortalité de l'établissement (US-13) (PR #16, Kaze)
- Espace parent léger avec rappels, et dossier imprimable (US-06, US-07, US-08) (PR #15, Kaze)
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
