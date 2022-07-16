import { GameInfo, Player, Room } from "./IGameData";

export interface ServerToClientEvents {
  getUserInfo: (player: Player) => void;
  enterRoom: (room: Room) => void;
  leaveRoom: (room: Room) => void;
  message: (msg: string, userName: string, isSystemMsg: boolean) => void;
  nextPlay: (gameInfo: GameInfo) => void;
}

export interface ClientToServerEvents {
  createUser: (name: string) => void;
  enterRoom: (player: Player, roomId: string) => void;
  leaveRoom: (player: Player, roomId: string) => void;
  message: (msg: string, userName: string, roomId: string) => void;
  startGame: (roomId: string) => void;
}

export interface InterServerEvents {
  
}

export interface SocketData {
 
}
