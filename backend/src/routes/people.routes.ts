import { Router } from "express";
import { getPeople } from "../controllers/people.controller";

const router = Router();
router.get("/", getPeople);
export default router;
