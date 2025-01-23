export type ActionState = {
  status?: "ERROR" | "SUCCESS" | "ERROR2";
  message: string;
  payload?: FormData;
  fieldErrors: Record<string, string[] | undefined>;
};
