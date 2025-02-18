export enum ConnectionState {
  Offline,
  Online,
  Playing
}

export enum Request {
  Pending,
  Accepted,
  Declined
}

export enum Action {
  Random,
  CancelRandom,
  InviteFriend,
  AcceptInvitation,
  RejectInvitation
}