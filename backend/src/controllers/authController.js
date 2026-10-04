import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import * as UtilisateurModel from "../models/utilisateurModel.js";
import { nettoyerTelephone } from "./parentController.js";

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { telephone, mot_de_passe } = req.body;

    if (!telephone || !mot_de_passe) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Le téléphone et le mot de passe sont obligatoires",
        });
    }

    const utilisateur = await UtilisateurModel.getUtilisateurByTelephone(
      nettoyerTelephone(telephone),
    );

    // Même message pour un téléphone inconnu ou un mauvais mot de passe, pour ne rien révéler
    const motDePasseValide = utilisateur
      ? await bcrypt.compare(
          String(mot_de_passe),
          utilisateur.mot_de_passe_hash,
        )
      : false;

    if (!utilisateur || !motDePasseValide || !utilisateur.actif) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Téléphone ou mot de passe incorrect",
        });
    }

    // Le token contient les informations lues par le middleware authentifier
    const token = jwt.sign(
      {
        id: utilisateur.id,
        role: utilisateur.role,
        etablissement_id: utilisateur.etablissement_id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    console.log(process.env.JWT_SECRET);

    // On retire le mot de passe haché avant de répondre
    delete utilisateur.mot_de_passe_hash;

    res
      .status(200)
      .json({
        success: true,
        message: "Connexion réussie",
        data: { token, utilisateur },
      });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Erreur serveur lors de la connexion" });
  }
};

// GET /api/auth/moi
export const moi = async (req, res) => {
  try {
    const utilisateur = await UtilisateurModel.getUtilisateurById(req.user.id);
    if (!utilisateur || !utilisateur.actif) {
      return res
        .status(401)
        .json({ success: false, message: "Compte introuvable ou désactivé" });
    }

    // Un parent reçoit aussi la liste de ses dossiers
    const dossiers =
      utilisateur.role === "parent"
        ? await UtilisateurModel.getDossiersDuParent(utilisateur.id)
        : [];

    res.status(200).json({ success: true, data: { utilisateur, dossiers } });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur serveur lors de la récupération du profil",
      });
  }
};
