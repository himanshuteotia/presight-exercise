export enum ProcessStatus {
  PENDING = "PENDING",
  DONE = "DONE",
}

export type ProcessResult = {
  id: string;
  status: ProcessStatus;
  result?: string;
};
