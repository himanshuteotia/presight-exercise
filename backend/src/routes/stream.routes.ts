import { Router } from "express";
import { streamText } from "../controllers/stream.controller";

const router = Router();
router.get("/text", streamText);
export default router;
