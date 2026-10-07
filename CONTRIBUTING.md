# Guide de contribution : Enroll Baby

Ce guide s'applique à toute l'équipe fullstack de la Squad 6. Il reprend les règles du guide Akieni Academy et les adapte à notre dépôt.

## Règle d'or

On ne pousse **jamais** directement sur `dev` ni sur `main`, et on ne fusionne **jamais** en ligne de commande. Tout passe par une Pull Request (PR) ouverte sur GitHub.

## Branches

| Branche | Usage |
|---|---|
| `main` | Version stable, livrée au jury |
| `dev` | Branche d'intégration, point de départ de tout le monde |
| `feature/<nom>` | Nouvelle fonctionnalité ou nouvelle page |
| `fix/<nom>` | Correction de bug |
| `docs/<nom>` | Documentation (README, CHANGELOG, guides) |
| `chore/<nom>` | Configuration, dépendances, structure |

Exemples : `feature/US-05-calendrier-vaccinal`, `feature/page-connexion`, `fix/statut-vital`, `docs/documentation-projet`.

## Commits

Format : `<type>: <description>`

- Types : `feat`, `fix`, `style`, `refactor`, `docs`, `chore`.
- Description **en minuscules, sans accents, à la forme nominale** (« ajout de », « correction de », pas « ajoute »).
- Un commit = un sujet. Pas de commit fourre-tout (`update`, `fix stuff`).

Exemples :

```
feat: ajout de la confirmation d'un vaccin administre
fix: correction du nom du fichier du controleur de rendez-vous
docs: mise a jour de la structure du projet dans le readme
```

## Workflow personnel

1. Récupérer le projet : `git clone https://github.com/KazeHolloway/s17-genesis-enroll-baby.git`
2. Se placer sur `dev` et se mettre à jour : `git checkout dev` puis `git pull`
3. Créer sa branche : `git switch -c feature/nom-de-la-page`
4. Travailler, puis committer : `git add <fichiers>` puis `git commit -m "feat: ..."`
5. Pousser : `git push -u origin feature/nom-de-la-page`
6. Ouvrir une PR sur GitHub : base `dev`, compare `feature/nom-de-la-page`
7. Assigner le Repo Admin (`KazeHolloway`) en reviewer : c'est lui qui fusionne
8. Ne pas supprimer sa branche après la fusion : elle prouve votre travail

## Récupérer le travail des autres sans rien perdre

Quand une PR est fusionnée dans `dev`, tous les autres développeurs se mettent à jour :

1. Sur sa branche, **committer le travail en cours** (sans `push`) : `git add <fichiers>` puis `git commit -m "feat: travail en cours sur ..."`
2. Aller chercher `dev` : `git checkout dev` puis `git pull`
3. Revenir sur sa branche : `git checkout feature/votre-page`
4. Ramener les nouveautés : `git merge dev`

En cas de conflit, ne lancez pas de commandes au hasard : corrigez les fichiers concernés, puis `git add .` et `git commit -m "fix: resolution des conflits avec dev"`. En cas de doute, demandez de l'aide avant de continuer.

## Règles pour le frontend (React)

- Chacun crée ses fichiers dans `frontend/src/pages/dossier-de-sa-page/`.
- Les **dossiers** sont en `kebab-case` (minuscules avec des tirets) : `dossier-de-ma-page/`.
- Les **composants** sont en `PascalCase` : `MonComposant.tsx` et `MonComposant.css`.
- Les commentaires sont en français, accentués, un commentaire par ligne.
- Le style va dans le fichier CSS, pas en `style` inline.
- Le site doit être responsive (media queries pour tablette et mobile).

## Règles pour le backend

- Architecture MVC : routes, contrôleurs, modèles, utilitaires dans leurs dossiers respectifs.
- Les routes protégées utilisent `authentifier` puis `autoriser(...)` avec les bons rôles.
- Les requêtes SQL sont paramétrées (`$1`, `$2`), jamais construites par concaténation.
- Toute valeur utilisateur affichée dans du HTML est échappée.
- La documentation des routes est dans `backend/BACKEND-API.md` : la mettre à jour si une route change.

## Avant de pousser

- [ ] Le code s'exécute sans erreur (`npm run dev:back` ou `npm run dev:front`)
- [ ] Aucun secret n'est inclus (`.env`, clés) : vérifier le `.gitignore`
- [ ] Le message de commit suit la convention ci-dessus
- [ ] Le README et `BACKEND-API.md` sont à jour si l'installation ou l'usage a changé

## Base de données

Pour repartir d'une base propre avec des données de test :

```
psql -U postgres -c "CREATE DATABASE enroll_baby"
psql -U postgres -d enroll_baby -f backend/src/database/schema.sql
psql -U postgres -d enroll_baby -f backend/src/database/seed.sql
```

## Besoin d'aide ?

Écrivez dans le groupe WhatsApp de la Squad, ou contactez le Repo Admin (`KazeHolloway`).
