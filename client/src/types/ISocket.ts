import { Player, Room } from "./IGameData";

export interface ServerToClientEvents {
  getUserInfo: (player: Player) => void;
  enterRoom: (room: Room) => void;
  leaveRoom: (room: Room) => void;
}

export interface ClientToServerEvents {
  createUser: (name: string) => void;
  enterRoom: (player: Player, roomId: string) => void;
  leaveRoom: (uid: string, roomId: string) => void;
}

export interface InterServerEvents {
  
}

export interface SocketData {
 
}
