import { ProcessStatus } from "../../../shared/types/process";
import { jobQueue } from "../queue/inMemoryQueue";
import { broadcast } from "../websocket/ws.server";

export async function startWorker() {
  while (true) {
    const job = jobQueue.dequeue();

    if (!job) {
      await sleep(100);
      continue;
    }

    await sleep(2000);

    job.status = ProcessStatus.DONE;
    job.result = `Processed ${job.id}`;

    broadcast(job);
  }
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
