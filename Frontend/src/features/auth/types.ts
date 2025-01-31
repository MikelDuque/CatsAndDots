export type ActionState = {
  status?: "FORM-ERROR" | "SUCCESS" | "PROMISE-ERROR";
  message: string;
  payload?: FormData;
  fieldErrors: Record<string, string[] | undefined>;
};

export type GenericMessage = {
  MessageType: string;
  Body: Record<string, unknown>;
};

export type MenuData = {
  OnlineUsers: number;
  PlayingUsers: number;
	CurrentMatches: number;
}