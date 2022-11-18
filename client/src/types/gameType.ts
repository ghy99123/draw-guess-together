export type Message = {
  msg: string;
  color: string;
};

export enum GameStatus {
  WAITING,
  ROUND_BEFORE,
  ROUND_START,
  ROUND_END,
  GAME_END,
}

export type Coordinate = {
  x: number;
  y: number;
};
