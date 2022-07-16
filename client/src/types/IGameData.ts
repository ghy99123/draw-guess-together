export type Player = {
  userName: string;
  uid: string | null;
};

export type Room = {
  players: Player[];
  roomId: string;
  admin: Player;
};

export type GameInfo = {
  painter: Player;
  painterIndex: number;
  room: Room;
  round: number;
  totalRound: number;
  answer: string;
} | null;
