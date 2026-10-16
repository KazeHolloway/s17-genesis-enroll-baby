# Diagramme entité-relation (ERD)

Ce diagramme est issu du fichier [`schema.sql`](schema.sql). Il montre les 15 tables, leurs clés primaires (PK), leurs clés étrangères (FK) et leurs champs uniques (UK).

GitHub affiche directement le bloc Mermaid ci-dessous, sans image externe.

```mermaid
erDiagram
    ETABLISSEMENTS |o--o{ UTILISATEURS : "emploie"
    UTILISATEURS ||--o{ REFRESH_TOKENS : "possède"
    UTILISATEURS |o--o| PARENTS : "compte lié"
    ETABLISSEMENTS ||--o{ ENFANTS : "accueille"
    UTILISATEURS ||--o{ ENFANTS : "enregistre (agent)"
    ENFANTS ||--o{ ENFANT_PARENTS : "a pour"
    PARENTS ||--o{ ENFANT_PARENTS : "est lié à"
    ENFANTS ||--o| DOSSIERS : "possède"
    DOSSIERS ||--o| DECLARATIONS_NAISSANCE : "donne lieu à"
    UTILISATEURS ||--o{ ACCES_DOSSIER : "consulte"
    DOSSIERS ||--o{ ACCES_DOSSIER : "est consulté par"
    VACCINS ||--o{ CALENDRIER_VACCINAL : "se planifie dans"
    ENFANTS ||--o{ VACCINATIONS : "reçoit"
    CALENDRIER_VACCINAL ||--o{ VACCINATIONS : "définit"
    UTILISATEURS |o--o{ VACCINATIONS : "administre (agent)"
    ETABLISSEMENTS |o--o{ VACCINATIONS : "lieu"
    ENFANTS ||--o{ RAPPELS : "concerne"
    DECLARATIONS_NAISSANCE |o--o{ RAPPELS : "rappel de déclaration"
    VACCINATIONS |o--o{ RAPPELS : "rappel de vaccin"
    ENFANTS ||--o{ RENDEZ_VOUS : "a"
    ETABLISSEMENTS ||--o{ RENDEZ_VOUS : "reçoit"
    VACCINATIONS |o--o{ RENDEZ_VOUS : "prépare"
    UTILISATEURS |o--o{ JOURNAL_AUDIT : "génère"

    ETABLISSEMENTS {
        int id PK
        varchar nom
        varchar ville
        varchar adresse
        varchar telephone
        boolean actif
        timestamptz created_at
    }

    UTILISATEURS {
        int id PK
        varchar nom_complet
        varchar telephone UK
        varchar email UK
        varchar mot_de_passe_hash
        role_utilisateur role
        int etablissement_id FK
        boolean actif
        timestamptz created_at
        timestamptz updated_at
    }

    REFRESH_TOKENS {
        int id PK
        int utilisateur_id FK
        varchar token_hash UK
        timestamptz expires_at
        boolean revoque
        timestamptz created_at
    }

    PARENTS {
        int id PK
        varchar nom
        varchar prenom
        varchar telephone
        varchar email
        varchar adresse
        int utilisateur_id FK, UK
        timestamptz created_at
    }

    ENFANTS {
        int id PK
        varchar nom
        varchar prenom
        sexe_enfant sexe
        date date_naissance
        varchar lieu_naissance
        varchar photo_url
        numeric poids_naissance
        numeric taille_naissance
        statut_vital statut_vital
        int etablissement_id FK
        int agent_id FK
        timestamptz created_at
        timestamptz updated_at
    }

    ENFANT_PARENTS {
        int enfant_id PK, FK
        int parent_id PK, FK
        lien_parente lien
    }

    DOSSIERS {
        int id PK
        int enfant_id FK, UK
        varchar numero_dossier UK
        varchar code_acces_hash
        timestamptz code_expire_at
        statut_dossier statut
        timestamptz created_at
    }

    ACCES_DOSSIER {
        int utilisateur_id PK, FK
        int dossier_id PK, FK
        timestamptz date_rattachement
    }

    DECLARATIONS_NAISSANCE {
        int id PK
        int dossier_id FK, UK
        varchar numero UK
        date date_emission
        date date_limite
        statut_declaration statut
        date date_declaration
        varchar certificat_token UK
        varchar certificat_url
        timestamptz created_at
    }

    VACCINS {
        int id PK
        varchar code UK
        varchar nom
        text description
    }

    CALENDRIER_VACCINAL {
        int id PK
        int vaccin_id FK
        smallint dose_numero
        int age_cible_jours
        smallint version
        date date_effet
        boolean actif
    }

    VACCINATIONS {
        int id PK
        int enfant_id FK
        int calendrier_id FK
        date date_prevue
        statut_vaccination statut
        date date_administration
        int agent_id FK
        int etablissement_id FK
        varchar numero_lot
        timestamptz created_at
    }

    RAPPELS {
        int id PK
        int enfant_id FK
        type_rappel type
        int declaration_id FK
        int vaccination_id FK
        date date_echeance
        date date_affichage
        statut_rappel statut
        timestamptz lu_at
        timestamptz created_at
    }

    RENDEZ_VOUS {
        int id PK
        int enfant_id FK
        int etablissement_id FK
        int vaccination_id FK
        timestamptz date_rdv
        varchar motif
        statut_rdv statut
        timestamptz created_at
    }

    JOURNAL_AUDIT {
        bigint id PK
        int utilisateur_id FK
        varchar action
        varchar entite
        int entite_id
        jsonb details
        inet ip
        timestamptz created_at
    }
```

## Types énumérés

| Type | Valeurs |
|------|---------|
| `role_utilisateur` | `parent`, `agent_maternite`, `admin` |
| `sexe_enfant` | `M`, `F` |
| `statut_vital` | `vivant`, `mort_ne`, `decede` |
| `lien_parente` | `mere`, `pere`, `tuteur` |
| `statut_dossier` | `actif`, `archive` |
| `statut_declaration` | `en_attente`, `declaree`, `hors_delai` |
| `statut_vaccination` | `a_venir`, `effectue`, `en_retard` |
| `type_rappel` | `declaration`, `vaccin` |
| `statut_rappel` | `a_venir`, `affiche`, `lu`, `clos` |
| `statut_rdv` | `planifie`, `honore`, `manque`, `annule` |

## Contraintes de cohérence

Ces règles sont garanties par la base elle-même, même si l'application contient une erreur.

| Table | Contrainte | Règle |
|-------|------------|-------|
| `utilisateurs` | `chk_agent_etablissement` | Un agent de maternité est obligatoirement rattaché à un établissement. |
| `enfants` | `chk_date_naissance` | La date de naissance ne peut pas être dans le futur. |
| `declarations_naissance` | `chk_declaree_date` | Une déclaration au statut `declaree` doit avoir une date de déclaration. |
| `vaccinations` | `chk_effectue_date` | Une vaccination `effectue` doit avoir une date d'administration. |
| `vaccinations` | `uq_enfant_calendrier` | Un enfant ne peut recevoir qu'une fois la même dose du calendrier. |
| `calendrier_vaccinal` | `age_cible_jours >= 0` et `dose_numero > 0` | Âge cible et numéro de dose cohérents. |
| `calendrier_vaccinal` | `uq_vaccin_dose_version` | Une seule ligne par vaccin, dose et version du calendrier. |
| `rappels` | `chk_rappel_cible` | Un rappel de type `declaration` pointe vers une déclaration, un rappel de type `vaccin` pointe vers une vaccination, jamais les deux. |

## Règles de suppression des clés étrangères

- **`ON DELETE CASCADE`** : la suppression d'un enfant supprime ses dossiers, vaccinations, rappels, rendez-vous et liens avec les parents. La suppression d'un utilisateur supprime ses jetons et ses accès aux dossiers.
- **`ON DELETE SET NULL`** : la suppression d'un établissement ne supprime pas ses utilisateurs, et la suppression d'un compte utilisateur conserve la fiche du parent (`parents.utilisateur_id` devient nul).
- **Sans action (par défaut)** : un établissement ou un agent référencé par un enfant ne peut pas être supprimé, ce qui protège l'historique.

## Automatismes

| Déclencheur | Rôle |
|-------------|------|
| `trg_declaration_date_limite` | À la création d'une déclaration, calcule la date limite : date de naissance + 30 jours. |
| `trg_enfants_updated` et `trg_utilisateurs_updated` | Mettent à jour `updated_at` à chaque modification. |

Deux vues alimentent les statistiques : `v_stats_natalite` (naissances par mois et par établissement, garçons et filles) et `v_stats_mortalite` (mort-nés et décès par mois et par établissement).
