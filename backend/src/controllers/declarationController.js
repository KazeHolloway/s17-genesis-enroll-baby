import crypto from "crypto";
import * as ImprimableModel from "../models/imprimableModel.js";
import * as DeclarationModel from "../models/declarationModel.js";
import * as CalendrierModel from "../models/calendrierModel.js";
import { construireDeclaration } from "../utils/rappels.js";
import { construireDocument } from "../utils/documentsHtml.js";
import { formaterDate } from "../utils/formaterDate.js";
import { estDateValide, dateDuJour } from "../utils/validerDate.js";

// Charge le dossier demandé et vérifie que l'utilisateur a le droit de le consulter
const chargerDossierAutorise = async (req, res) => {
  const dossierId = Number(req.params.dossierId);
  if (!Number.isInteger(dossierId)) {
    res.status(400).json({ success: false, message: "Identifiant invalide" });
    return null;
  }
  const dossier = await ImprimableModel.getDossierComplet(dossierId);
  const autorise =
    dossier &&
    (await CalendrierModel.peutVoirEnfant(req.user, dossier.enfant_id));

  // Même réponse si le dossier n'existe pas ou si l'accès est refusé
  if (!autorise) {
    res.status(404).json({ success: false, message: "Dossier introuvable" });
    return null;
  }
  return dossier;
};

// Génère la déclaration si elle n'existe pas encore, puis renvoie le dossier à jour
const assurerDeclaration = async (dossier) => {
  if (dossier.declaration_numero) return dossier;
  await DeclarationModel.creerDeclaration(
    dossier.dossier_id,
    crypto.randomBytes(24).toString("hex"),
  );
  return ImprimableModel.getDossierComplet(dossier.dossier_id);
};

// Phrase affichée au parent selon la situation du délai de 30 jours
const construireMessage = (declaration) => {
  if (declaration.statut === "declaree") {
    return `Naissance déclarée à l’état civil le ${formaterDate(declaration.date_declaration)}`;
  }
  if (declaration.statut === "delai_expire") {
    return "Le délai de 30 jours est dépassé : une déclaration tardive peut être nécessaire";
  }
  const jours = declaration.jours_restants;
  return `Il reste ${jours} jour${jours > 1 ? "s" : ""} pour déclarer la naissance (avant le ${formaterDate(declaration.date_limite)})`;
};

// Résumé du compte à rebours
const construireCompteARebours = (dossier) => {
  const declaration = construireDeclaration(dossier);
  return { ...declaration, message: construireMessage(declaration) };
};

// GET /api/declarations/dossier/:dossierId/compte-a-rebours
export const getCompteARebours = async (req, res) => {
  try {
    const dossier = await chargerDossierAutorise(req, res);
    if (!dossier) return;

    // Date de naissance absente : le compte à rebours ne peut pas démarrer
    if (!dossier.date_naissance) {
      return res.status(422).json({
        success: false,
        message:
          "Date de naissance manquante : les informations doivent être complétées",
      });
    }

    res
      .status(200)
      .json({ success: true, data: construireCompteARebours(dossier) });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur serveur lors du calcul du compte à rebours",
      });
  }
};

// GET /api/declarations/dossier/:dossierId
export const getDeclarationDossier = async (req, res) => {
  try {
    const charge = await chargerDossierAutorise(req, res);
    if (!charge) return;

    const dossier = await assurerDeclaration(charge);
    const declaration = await DeclarationModel.getDeclaration(
      dossier.dossier_id,
    );

    res.status(200).json({
      success: true,
      data: {
        numero: declaration.numero,
        date_emission: declaration.date_emission,
        statut: declaration.statut,
        certificat_url: declaration.certificat_url,
        compte_a_rebours: construireCompteARebours(dossier),
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur serveur lors de la génération de la déclaration",
      });
  }
};

// GET /api/declarations/dossier/:dossierId/imprimable
export const getDeclarationImprimable = async (req, res) => {
  try {
    const charge = await chargerDossierAutorise(req, res);
    if (!charge) return;

    const dossier = await assurerDeclaration(charge);
    const parents = await ImprimableModel.getParentsEnfant(dossier.enfant_id);

    const page = construireDocument({
      titre: "Déclaration de naissance",
      dossier,
      parents,
      declaration: construireDeclaration(dossier),
      avecSignatures: true,
      mentions: [
        "Cette déclaration doit être signée par la sage-femme : seul le document signé est officiel.",
        "Elle ne remplace pas la démarche physique auprès de la mairie, à effectuer dans les 30 jours.",
      ],
    });

    res.status(200).type("html").send(page);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message:
          "Erreur serveur lors de la génération de la déclaration imprimable",
      });
  }
};

// PUT /api/declarations/dossier/:dossierId/declarer
export const declarer = async (req, res) => {
  try {
    const charge = await chargerDossierAutorise(req, res);
    if (!charge) return;

    const dateDeclaration = req.body.date_declaration || dateDuJour();
    if (!estDateValide(dateDeclaration) || dateDeclaration > dateDuJour()) {
      return res.status(400).json({
        success: false,
        message:
          "Date de déclaration invalide (format AAAA-MM-JJ, pas dans le futur)",
      });
    }
    if (dateDeclaration < charge.date_naissance) {
      return res.status(400).json({
        success: false,
        message:
          "La date de déclaration ne peut pas précéder la date de naissance",
      });
    }

    await assurerDeclaration(charge);
    await DeclarationModel.marquerDeclaree(charge.dossier_id, dateDeclaration);

    // On recharge le dossier pour renvoyer le compte à rebours arrêté
    const misAJour = await ImprimableModel.getDossierComplet(charge.dossier_id);
    res.status(200).json({
      success: true,
      message: "Déclaration enregistrée",
      data: construireCompteARebours(misAJour),
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur serveur lors de l’enregistrement de la déclaration",
      });
  }
};

// GET /api/certificats/:token (route publique, protégée par le jeton secret)
export const getCertificat = async (req, res) => {
  try {
    const dossierId = await DeclarationModel.getDossierIdParToken(
      req.params.token,
    );
    const dossier = dossierId
      ? await ImprimableModel.getDossierComplet(dossierId)
      : null;
    if (!dossier) {
      return res
        .status(404)
        .json({ success: false, message: "Certificat introuvable" });
    }

    const parents = await ImprimableModel.getParentsEnfant(dossier.enfant_id);

    const page = construireDocument({
      titre: "Certificat numérique de naissance",
      dossier,
      parents,
      declaration: construireDeclaration(dossier),
      avecSignatures: false,
      mentions: [
        "Ce certificat numérique complète la déclaration signée par la sage-femme, qui reste le document officiel.",
        "Il ne remplace pas la démarche physique auprès de la mairie.",
      ],
    });

    res.status(200).type("html").send(page);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Erreur serveur lors de la génération du certificat",
      });
  }
};
