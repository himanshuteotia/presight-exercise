import { ProcessResult, ProcessStatus } from "../../../shared/types/process";


class InMemoryQueue {
  private queue: ProcessResult[] = [];

  enqueue(): ProcessResult {
    const job: ProcessResult = {
      id: crypto.randomUUID(),
      status: ProcessStatus.PENDING
    };

    this.queue.push(job);
    return job;
  }

  dequeue(): ProcessResult | undefined {
    return this.queue.shift();
  }
}

export const jobQueue = new InMemoryQueue();
