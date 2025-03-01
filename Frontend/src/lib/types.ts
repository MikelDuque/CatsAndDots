import { ConnectionState, RequestState } from "./enums";

/* ----- Backend Types ----- */

export type GenericMessage = {
  messageType: string;
  body: Record<string, unknown>;
};

export type User = {
  id: number
  username: string
  avatar: string
  connectionState?: ConnectionState
}

export type MenuData = {
  onlineUsers: number;
  playingUsers: number;
	currentMatches: number;
};

export type PendingFriends = {
  receivedFriendList: User[],
  sentFriendList: User[],
  receivedFriendRequests?: Request[]
}

export type Request = {
  senderId: number
  receiverId: number
  state: RequestState
}


/* ----- Frontend Types ----- */

export type ActionState = {
  status?: "FORM-ERROR" | "SUCCESS" | "PROMISE-ERROR";
  message: string;
  payload?: FormData;
  fieldErrors: Record<string, string[] | undefined>;
};

export type FormProps = {
  hasFlip: boolean,
  flipCard: () => void
}

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