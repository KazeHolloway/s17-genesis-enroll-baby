import bcrypt from 'bcrypt';
import * as AgentModel from '../models/agentModel.js';
import { nettoyerTelephone } from './parentController.js';

/**
 * Console super admin : comptes agents/administrateurs (`/api/agents`).
 * Toutes les routes sont réservées à un utilisateur connecté en `admin`
 * (voir `routes/agentRoute.js`).
 */

const LIBELLES_ROLE = ['Sage-femme', 'Officier État Civil', 'Médecin Chef', 'Administrateur'];

/** Échappe la contrainte `chk_agent_etablissement` : `metier` → rôle technique. */
const roleTechnique = (libelle) => (libelle === 'Administrateur' ? 'admin' : 'agent_maternite');

const erreurServeur = (res, error) => {
  console.error(error);
  res.status(500).json({ success: false, message: 'Erreur serveur lors de la gestion des agents' });
};

// GET /api/agents
export const lister = async (req, res) => {
  try {
    const agents = await AgentModel.listerAgents();
    res.status(200).json({ success: true, data: agents });
  } catch (error) {
    erreurServeur(res, error);
  }
};

// POST /api/agents
export const creer = async (req, res) => {
  try {
    const {
      nom,
      telephone,
      email = '',
      matricule,
      etablissement,
      ville = '',
      role,
      mot_de_passe,
    } = req.body;

    if (!nom || !String(nom).trim() || !telephone || !matricule || !String(matricule).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Nom, téléphone et matricule sont obligatoires',
      });
    }
    if (!etablissement || !String(etablissement).trim()) {
      return res.status(400).json({ success: false, message: "L'établissement est obligatoire" });
    }
    if (!mot_de_passe || String(mot_de_passe).length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe provisoire doit contenir au moins 8 caractères',
      });
    }

    const telephoneNettoye = nettoyerTelephone(telephone);
    const matriculePropre = String(matricule).trim().toUpperCase();
    const libelleRole = LIBELLES_ROLE.includes(role) ? role : 'Sage-femme';

    if (await AgentModel.telephoneDejaUtilise(telephoneNettoye)) {
      return res
        .status(409)
        .json({ success: false, message: 'Ce numéro de téléphone est déjà utilisé' });
    }
    if (await AgentModel.matriculeDejaUtilise(matriculePropre)) {
      return res
        .status(409)
        .json({ success: false, message: 'Ce matricule est déjà attribué' });
    }

    const etablissementId = await AgentModel.resoudreEtablissement(etablissement, ville);
    const hash = await bcrypt.hash(String(mot_de_passe), 10);

    const agent = await AgentModel.creerAgent({
      nom: String(nom).trim(),
      telephone: telephoneNettoye,
      email: String(email).trim(),
      hash,
      role: roleTechnique(libelleRole),
      matricule: matriculePropre,
      metier: libelleRole,
      etablissementId,
    });

    res.status(201).json({ success: true, message: 'Compte agent créé', data: agent });
  } catch (error) {
    if (error.code === '23505') {
      return res
        .status(409)
        .json({ success: false, message: 'Téléphone ou matricule déjà utilisé' });
    }
    erreurServeur(res, error);
  }
};

// PUT /api/agents/:id
export const modifier = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Identifiant invalide' });
    }

    const {
      nom,
      telephone,
      email = '',
      matricule,
      etablissement,
      ville = '',
      role,
      mot_de_passe,
      actif,
    } = req.body;

    if (!nom || !String(nom).trim() || !telephone || !matricule || !String(matricule).trim()) {
      return res.status(400).json({
        success: false,
        message: 'Nom, téléphone et matricule sont obligatoires',
      });
    }
    if (!etablissement || !String(etablissement).trim()) {
      return res.status(400).json({ success: false, message: "L'établissement est obligatoire" });
    }
    if (mot_de_passe !== undefined && String(mot_de_passe).length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Le mot de passe provisoire doit contenir au moins 8 caractères',
      });
    }

    const telephoneNettoye = nettoyerTelephone(telephone);
    const matriculePropre = String(matricule).trim().toUpperCase();
    const libelleRole = LIBELLES_ROLE.includes(role) ? role : 'Sage-femme';

    if (await AgentModel.telephoneDejaUtilise(telephoneNettoye, id)) {
      return res
        .status(409)
        .json({ success: false, message: 'Ce numéro de téléphone est déjà utilisé' });
    }
    if (await AgentModel.matriculeDejaUtilise(matriculePropre, id)) {
      return res
        .status(409)
        .json({ success: false, message: 'Ce matricule est déjà attribué' });
    }

    // Un administrateur ne se coupe pas lui-même l'accès à la console.
    if (id === Number(req.user.id) && actif === false) {
      return res.status(400).json({
        success: false,
        message: 'Vous ne pouvez pas désactiver votre propre compte',
      });
    }

    const etablissementId = await AgentModel.resoudreEtablissement(etablissement, ville);
    const hash =
      mot_de_passe === undefined ? null : await bcrypt.hash(String(mot_de_passe), 10);

    const agent = await AgentModel.modifierAgent(id, {
      nom: String(nom).trim(),
      telephone: telephoneNettoye,
      email: String(email).trim(),
      hash,
      role: roleTechnique(libelleRole),
      matricule: matriculePropre,
      metier: libelleRole,
      etablissementId,
      actif: typeof actif === 'boolean' ? actif : undefined,
    });

    if (!agent) {
      return res.status(404).json({ success: false, message: 'Agent introuvable' });
    }

    res.status(200).json({ success: true, message: 'Compte agent mis à jour', data: agent });
  } catch (error) {
    if (error.code === '23505') {
      return res
        .status(409)
        .json({ success: false, message: 'Téléphone ou matricule déjà utilisé' });
    }
    erreurServeur(res, error);
  }
};

// DELETE /api/agents/:id
export const supprimer = async (req, res) => {
  try {
    const id = Number.parseInt(req.params.id, 10);
    if (Number.isNaN(id)) {
      return res.status(400).json({ success: false, message: 'Identifiant invalide' });
    }
    if (id === Number(req.user.id)) {
      return res
        .status(400)
        .json({ success: false, message: 'Impossible de supprimer votre propre compte' });
    }

    const existe = await AgentModel.supprimerAgent(id);
    if (!existe) {
      return res.status(404).json({ success: false, message: 'Agent introuvable' });
    }

    res.status(200).json({ success: true, message: 'Compte agent supprimé' });
  } catch (error) {
    if (error.code === '23503') {
      return res.status(409).json({
        success: false,
        message: 'Ce compte est encore rattaché à des dossiers et ne peut pas être supprimé',
      });
    }
    erreurServeur(res, error);
  }
};
