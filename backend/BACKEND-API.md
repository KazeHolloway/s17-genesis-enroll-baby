# Enroll Baby : guide du backend pour l'équipe front

Ce document explique **comment le backend fonctionne** et **comment l'appeler depuis React**. Il suit l'ordre d'un vrai parcours utilisateur.

## 1. Le workflow en 6 étapes (la logique à retenir)

```
AGENT DE MATERNITÉ                         PARENT
------------------                         ------
1. Se connecte (login)
2. Enregistre le nouveau-né + parents
   -> le backend crée le dossier
   -> le backend renvoie un CODE D'ACCÈS
3. Remet le code au parent (papier/oral)
                                           4. Crée son compte avec le code (inscription)
                                           5. Se connecte (login)
                                           6. Voit son espace : dossier, compte à rebours J+30,
                                              calendrier vaccinal, rappels, rendez-vous
```

**Réponse à la question « le code d'accès, on le trouve où ? »**

Le code est **généré par le backend quand l'agent de maternité enregistre le nouveau-né** (étape 2). Il est renvoyé **une seule fois**, dans la réponse de `POST /api/enfants/enregistrement`, dans le champ `dossier.code_acces`. Il a la forme `XXXX-XXXX-XXXX`. Ensuite il n'est plus jamais renvoyé par l'API (seule son empreinte secrète est gardée).

Conséquence pour le front : **l'écran de l'agent doit afficher le code en grand après l'enregistrement** (avec un bouton « copier » et « imprimer »), car c'est le seul moment où on le voit. Le parent saisit ensuite ce code sur l'écran d'inscription.

Un code ne sert qu'une fois : si un parent a déjà créé son compte avec, l'inscription suivante avec le même code répond `409`.

## 2. Pour tester tout de suite

Le fichier `backend/src/database/seed.sql` crée deux comptes de test :

| Rôle | Téléphone | Mot de passe |
|---|---|---|
| Agent de maternité | `+242060000001` | `Agent123!` |
| Admin | `+242060000002` | `Admin123!` |

Le seed contient aussi des données prêtes à l'emploi : 4 enfants, leurs parents, leurs dossiers, des vaccinations et des rendez-vous.

| Compte parent | Téléphone | Mot de passe | Situation |
|---|---|---|---|
| Marie Nzaba | `+242061000010` | `Parent123!` | Enfant né il y a 40 jours : délai de déclaration dépassé, rendez-vous dans 12 h |

Codes d'accès de test à utiliser sur `POST /api/parents/inscription` (chacun ne sert qu'une fois) :

| Code | Enfant | Situation |
|---|---|---|
| `ABCD-2345-EFGH` | Grâce Mabiala | Né il y a 5 jours, compte à rebours en cours |
| `JKLM-6789-NPQR` | Sarah Okemba | Naissance déjà déclarée à la mairie |
| `BCDF-3456-GHJK` | Enfant mort-né | Sert aux statistiques |

Le certificat public de Sarah Okemba est visible sur `/api/certificats/seed-certificat-okemba-sarah`.

Pour obtenir un code tout neuf : se connecter en agent, appeler `POST /api/enfants/enregistrement` (voir plus bas), copier `dossier.code_acces`, puis l'utiliser sur `POST /api/parents/inscription`.

Lancer le backend : `npm run dev:back` (port `5000`). URL de base : `http://localhost:5000/api`.

## 3. Règles générales à connaître

**Authentification.** Après le login, on reçoit un `token`. Il faut l'envoyer à chaque appel protégé :

```js
fetch(`${API}/parents/espace`, {
  headers: { Authorization: `Bearer ${token}` }
});
```

Le token dure 1 jour. Si l'API répond `401`, renvoyer l'utilisateur vers la page de connexion.

**Les 3 rôles** (champ `utilisateur.role`) : `parent`, `agent_maternite`, `admin`. Une route interdite à un rôle répond `403`.

**Les identifiants sont des nombres.** Pour `enfant_id`, `calendrier_id`, etc., envoyer `1` et **pas** `"1"`, sinon l'API répond `400`.

**Deux formes de réponse (attention).**
- La plupart des routes répondent `{ success, message, data }`. Les données sont dans `data`.
- Les routes `/api/enfants` et `/api/dossiers` répondent directement l'objet (pas de `data`), et les erreurs ont seulement `{ message }`.

**Codes d'erreur fréquents** : `400` données invalides, `401` pas connecté, `403` rôle interdit, `404` introuvable, `409` conflit (doublon, code déjà utilisé), `500` erreur serveur. Le champ `message` est en français et peut être affiché tel quel à l'utilisateur.

## 4. Écrans et routes

### A. Connexion (tous les rôles)

`POST /api/auth/login`

```json
{ "telephone": "+242060000001", "mot_de_passe": "Agent123!" }
```

Réponse `200` : `{ success, message, data: { token, utilisateur } }`. Le téléphone est accepté avec ou sans espaces (`+242 06 000 00 01`).

`GET /api/auth/moi` (protégé) : renvoie `data: { utilisateur, dossiers }`. Pour un parent, `dossiers` liste ses enfants (`dossier_id`, `numero_dossier`, `enfant_id`, `nom`, `prenom`, `date_naissance`). Utile pour recharger la session au rafraîchissement de la page.

### B. Écran agent : enregistrer un nouveau-né

`POST /api/enfants/enregistrement` (rôle `agent_maternite` uniquement)

```json
{
  "enfant": {
    "nom": "Mabiala", "prenom": "Grâce", "sexe": "F",
    "date_naissance": "2026-10-01",
    "lieu_naissance": "Brazzaville",
    "poids_naissance": 3.2, "taille_naissance": 50
  },
  "parents": [
    { "nom": "Mabiala", "prenom": "Julie", "lien": "mere", "telephone": "06 111 11 11" },
    { "nom": "Mabiala", "prenom": "Paul", "lien": "pere" }
  ]
}
```

Obligatoire : `enfant.nom`, `prenom`, `sexe` (`M` ou `F`), `date_naissance` (format `AAAA-MM-JJ`, pas dans le futur), et au moins un parent avec `nom`, `prenom`, `lien` (`mere`, `pere` ou `tuteur`).

Réponse `201` (objet direct) : contient `enfant`, `dossier` (dont **`dossier.code_acces`**), et les parents. Réponse `409` si le même enfant existe déjà (avec `enfant_id`).

Autres routes agent/admin (réponse directe, sans `data`) :
- `GET /api/enfants` et `GET /api/enfants/:id`
- `PUT /api/enfants/:id` (modifier)
- `GET /api/dossiers` et `GET /api/dossiers/:id`

### C. Écran parent : créer son compte

`POST /api/parents/inscription` (public, pas de token)

```json
{
  "code_acces": "ABCD-EFGH-JKLM",
  "nom": "Julie Mabiala",
  "telephone": "+242 06 111 11 12",
  "email": "julie@exemple.com",
  "mot_de_passe": "motdepasse1"
}
```

Obligatoires : `code_acces`, `nom`, `telephone`, `mot_de_passe` (8 caractères minimum). `email` est facultatif. Le code peut être saisi en minuscules, avec ou sans tirets.

Réponses : `201` compte créé (puis rediriger vers la connexion), `400` code invalide ou mot de passe trop court, `409` code déjà utilisé ou téléphone déjà pris.

### D. Espace parent (le plus important)

Un seul appel donne presque tout l'écran d'accueil :

`GET /api/parents/espace` (rôle `parent`) renvoie `data.enfants`, un tableau avec, pour chaque enfant :

| Champ | Contenu |
|---|---|
| `dossier` | `id`, `numero`, `statut` |
| `enfant` | `id`, `nom`, `prenom`, `sexe`, `date_naissance`, `lieu_naissance`, `etablissement` |
| `declaration` | compte à rebours J+30 (voir plus bas) |
| `prochaine_demarche` | phrase prête à afficher (« Déclarer la naissance avant le ... ») |
| `prochaine_echeance` | le prochain vaccin non fait |
| `echeances` | tout le calendrier vaccinal de l'enfant |
| `rappels` | alertes triées de la plus urgente à la moins urgente |

`GET /api/parents/rappels` renvoie seulement la liste des rappels (tous enfants confondus). Un rappel a `type` (`vaccin` ou `declaration`), `titre`, `date_echeance`, `jours_restants`, `statut` et `prochaine_demarche`.

### E. Compte à rebours de déclaration (J+30)

`GET /api/declarations/dossier/:dossierId/compte-a-rebours` (protégé)

`data.statut` vaut `en_cours` (il reste des jours), `delai_expire` (plus de 30 jours) ou `declaree`. `data.jours_restants` donne le nombre de jours et `data.message` une phrase prête à afficher.

L'agent ou l'admin enregistre la déclaration faite à la mairie avec `PUT /api/declarations/dossier/:dossierId/declarer` (corps facultatif `{ "date_declaration": "2026-10-04" }`, sinon la date du jour est utilisée).

### F. Calendrier vaccinal et confirmation d'un vaccin

`GET /api/calendrier-vaccinal/enfant/:enfantId` (protégé) renvoie :

```json
{ "success": true, "data": { "prochaine_echeance": { }, "echeances": [ ] } }
```

Chaque échéance a `vaccin_nom`, `dose_numero`, `date_prevue`, `jours_restants` et `statut`. Les statuts sont **`a_venir`**, **`en_retard`** et **`effectue`**. Chaque ligne contient aussi `calendrier_id`, nécessaire pour confirmer un vaccin.

`POST /api/vaccinations/confirmer` (**agent ou admin**, pas le parent)

```json
{ "enfant_id": 1, "calendrier_id": 3, "date_administration": "2026-10-04", "numero_lot": "LOT123" }
```

`date_administration` et `numero_lot` sont facultatifs. Après confirmation, l'échéance passe en `effectue`. Il n'existe pas de statut `non_administre` : une dose non faite reste `a_venir` ou devient `en_retard`.

### G. Rendez-vous de suivi et rappels 24 h

- `POST /api/rendez-vous` (agent/admin) : `{ "enfant_id": 1, "date_rdv": "2026-10-10T09:00:00Z", "motif": "Vaccin BCG" }`. La date doit être dans le futur.
- `PUT /api/rendez-vous/:id` (agent/admin) : modifier, ou annuler avec `{ "statut": "annule" }`. Statuts possibles : `planifie`, `honore`, `manque`, `annule`.
- `GET /api/rendez-vous/enfant/:enfantId` : liste des rendez-vous de l'enfant (le parent ne voit que ses enfants).
- `GET /api/rendez-vous/rappels` (parent) : les rendez-vous qui ont lieu **dans les prochaines 24 h**. Un rendez-vous plus lointain n'apparaît pas ici, c'est normal.

### H. Documents imprimables

- `GET /api/imprimable/dossier/:dossierId` : le dossier papier.
- `GET /api/declarations/dossier/:dossierId/imprimable` : la déclaration imprimable.
- `GET /api/certificats/:token` : le certificat numérique. Route **publique** (pas de token d'authentification), le `token` du certificat fait office de secret. L'URL complète est dans `certificat_url` (renvoyé par `GET /api/declarations/dossier/:dossierId`).

Ces routes renvoient **du HTML déjà prêt à imprimer, pas du JSON**. Piège : on ne peut pas faire un simple lien `<a href>` vers les deux premières, car le navigateur n'envoie pas le token. Il faut faire un `fetch` avec le token, puis afficher le HTML :

```js
const res = await fetch(`${API}/imprimable/dossier/${dossierId}`, {
  headers: { Authorization: `Bearer ${token}` }
});
const html = await res.text();
const fenetre = window.open('', '_blank');
fenetre.document.write(html);
fenetre.document.close();
fenetre.print();
```

### I. Statistiques de l'établissement (agent/admin)

`GET /api/statistiques?debut=2026-01-01&fin=2026-12-31` (les deux paramètres sont facultatifs). Renvoie `data: { periode, total, par_mois }` avec les naissances et les décès.

## 5. Questions fréquentes

**Le parent n'a pas de code, que faire ?** Il doit le demander à l'agent de la maternité. Aucune route ne permet de le retrouver (c'est voulu, pour la sécurité).

**Un parent peut-il voir l'enfant d'un autre ?** Non, l'API répond `404`.

**Pourquoi `403` sur une route ?** Le rôle connecté n'a pas le droit (par exemple un parent qui appelle `/api/enfants`). Il faut masquer ces écrans selon `utilisateur.role`.

**Pourquoi le serveur répond `400` alors que mes données semblent bonnes ?** Vérifier le format de la date (`AAAA-MM-JJ`) et que les identifiants sont des nombres.
