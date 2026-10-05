import express from "express";
import {
  getAll,
  getById,
  create,
  update,
  remove,
  register,
} from "../controllers/enfantController.js";
import { authentifier, autoriser } from "../middlewares/auth.js";

const router = express.Router();

// Toutes les routes exigent d'être connecté
router.use(authentifier);

router.get("/", autoriser("agent_maternite", "admin"), getAll);
router.get("/:id", autoriser("agent_maternite", "admin"), getById);
router.post("/", autoriser("agent_maternite", "admin"), create);
router.post("/enregistrement", autoriser("agent_maternite"), register);
router.put("/:id", autoriser("agent_maternite", "admin"), update);
router.delete("/:id", autoriser("admin"), remove);

export default router;
