import { Router } from "express";
import { getMeta } from "../controllers/meta.controller";

const router = Router();
router.get("/", getMeta);
export default router;
