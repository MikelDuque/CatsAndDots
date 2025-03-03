export enum ConnectionState {
  Offline,
  Online,
  Playing
}

export enum RequestState {
  Pending,
  Accepted,
  Rejected
}

export enum ListType {
  users,
  friends,
  sentFriendRequests,
  incomingFriendRequests,
  matchmaking
}