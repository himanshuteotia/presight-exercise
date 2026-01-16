import { Router } from "express";
import { queue } from "../services/queue.service";
import { worker } from "../workers/worker.manager";
import { ProcessStatus } from "../../../shared/types/process";

const router = Router();

router.post("/", (_, res) => {
  const id = crypto.randomUUID();

  const item = {
    id,
    status: ProcessStatus.PENDING,
    result: undefined
  };

  queue.set(id, item);

  worker.postMessage(id);

  res.json(item);
});

export default router;
