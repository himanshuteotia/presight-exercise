export type ProcessStatus = "pending" | "done";

export type ProcessResult = {
  id: string;
  status: ProcessStatus;
  result?: string;
};
