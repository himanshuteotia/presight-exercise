import { Router } from "express";
import type { ProcessResult } from "../../../shared/types/process";

const router = Router();
const queue = new Map<string, ProcessResult>();

router.post("/", (_, res) => {
  const id = crypto.randomUUID();
  queue.set(id, { id, status: "pending" });

  setTimeout(() => {
    queue.set(id, { id, status: "done", result: "Processed result" });
  }, 2000);

  res.json(queue.get(id));
});

export default router;
