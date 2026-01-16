export enum ProcessStatus {
  PENDING = "pending",
  DONE = "done"
}

export type ProcessResult = {
  id: string;
  status: ProcessStatus;
  result?: string;
};
