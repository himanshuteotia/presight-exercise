import { Router } from "express";
import { jobQueue } from "../queue/inMemoryQueue";

const router = Router();

router.post("/", (_req, res) => {
  const job = jobQueue.enqueue();
  res.json(job);
});

export default router;
