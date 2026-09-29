import { Router } from "express";
import { getScore } from "../controllers/score.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const router = Router();

router.get("/score/:rut", authenticateToken, getScore);

export default router;