import bcrypt from 'bcrypt';
import { hacherCodeAcces } from '../utils/codeAcces.js';
import * as ParentModel from '../models/parentModel.js';

// Retire les espaces, points et tirets d'un numéro de téléphone
export const nettoyerTelephone = (telephone) => String(telephone).replace(/[\s.-]/g, '');

// POST /api/parents/inscription
export const inscrire = async (req, res) => {
  try {
    const { code_acces, nom, telephone, email, mot_de_passe } = req.body;

    // Vérification des champs obligatoires
    if (!code_acces || !nom || !telephone || !mot_de_passe) {
      return res.status(400).json({
        success: false,
        message: 'Le code d’accès, le nom, le téléphone et le mot de passe sont obligatoires'
      });
    }

    const tel = nettoyerTelephone(telephone);
    if (!/^\+?[0-9]{8,15}$/.test(tel)) {
      return res.status(400).json({ success: false, message: 'Numéro de téléphone invalide' });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Adresse email invalide' });
    }
    if (String(mot_de_passe).length < 8) {
      return res.status(400).json({ success: false, message: 'Le mot de passe doit contenir au moins 8 caractères' });
    }

    // Recherche du dossier grâce à l'empreinte du code saisi
    const dossier = await ParentModel.getDossierByCodeHash(hacherCodeAcces(code_acces));
    const codeExpire = dossier && dossier.code_expire_at && new Date(dossier.code_expire_at) < new Date();

    // Même message pour un code inconnu, expiré ou d'un dossier archivé
    if (!dossier || dossier.statut !== 'actif' || codeExpire) {
      return res.status(400).json({ success: false, message: 'Code d’accès invalide ou expiré' });
    }
    if (dossier.deja_utilise) {
      return res.status(409).json({ success: false, message: 'Ce code d’accès a déjà été utilisé' });
    }

    const motDePasseHash = await bcrypt.hash(String(mot_de_passe), 10);

    const utilisateur = await ParentModel.createParentAccount({
      dossier_id: dossier.id,
      enfant_id: dossier.enfant_id,
      nom_complet: String(nom).trim(),
      telephone: tel,
      email: email || null,
      mot_de_passe_hash: motDePasseHash
    });

    res.status(201).json({
      success: true,
      message: 'Compte parent créé avec succès',
      data: { utilisateur, dossier_id: dossier.id }
    });
  } catch (error) {
    console.error(error);
    if (error.code === 'CODE_UTILISE') {
      return res.status(409).json({ success: false, message: 'Ce code d’accès a déjà été utilisé' });
    }
    if (error.code === '23505') { // Violation d'unicité : téléphone ou email déjà pris
      return res.status(409).json({ success: false, message: 'Ce numéro de téléphone ou cet email est déjà utilisé' });
    }
    res.status(500).json({ success: false, message: 'Erreur serveur lors de la création du compte' });
  }
};