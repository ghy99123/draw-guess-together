import { Coordinate } from "./gameType";
import { GameInfo, Player, Room } from "./IGameData";

export interface ServerToClientEvents {
  getUserInfo: (player: Player) => void;
  enterRoom: (room: Room) => void;
  leaveRoom: (room: Room) => void;
  // message should be displayed on guessing area when msgType equals 0,
  // otherwise on chatting area
  message: (
    msg: string,
    userName: string,
    isSystemMsg: boolean,
    msgType: 0 | 1
  ) => void;
  nextPlay: (gameInfo: GameInfo) => void;
  draw: (
    mousePos: Coordinate,
    newMousePos: Coordinate,
    color: CanvasFillStrokeStyles["strokeStyle"],
    lineWidth: number
  ) => void;
}

export interface ClientToServerEvents {
  createUser: (name: string) => void;
  enterRoom: (player: Player, roomId: string) => void;
  leaveRoom: (player: Player, roomId: string) => void;
  message: (msg: string, userName: string, roomId: string) => void;
  guess: (guessWord: string, player: Player, roomId: string) => void;
  startGame: (roomId: string) => void;
  draw: (
    mousePos: Coordinate,
    newMousePos: Coordinate,
    color: CanvasFillStrokeStyles["strokeStyle"],
    lineWidth: number,
    roomId: string,
  ) => void;
}

export interface InterServerEvents {}

export interface SocketData {}
