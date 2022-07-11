
export type Player = {
  userName: string,
  uid: string | null,
}

export type Room = {
  players: Player[],
  roomId: string,
  admin: Player,
}