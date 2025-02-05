export type ActionState = {
  status?: "FORM-ERROR" | "SUCCESS" | "PROMISE-ERROR";
  message: string;
  payload?: FormData;
  fieldErrors: Record<string, string[] | undefined>;
};

export type FetchProps = {
  url: string;
  type: string;
  token?: string;
  params?: BodyInit | object;
  needAuth?: boolean;
  condition?: boolean;
};

export type DecodedToken = {
  id: number,
  unique_name: string,
  email: string,
  role: string,
  avatar: string,
  exp: number,
} | null | undefined;

export type GenericMessage = {
  messageType: string;
  body: Record<string, unknown>;
};

export type SocketMessage<K extends keyof string, T> = {
  [P in K]: T;
};

export type MenuData = {
  onlineUsers: number;
  playingUsers: number;
	currentMatches: number;
};

export type User = {
  id: number
  username: string
  avatar: string
  connectionState: ConnectionState
}

export enum ConnectionState
{
  Offline,
  Online,
  Playing
}