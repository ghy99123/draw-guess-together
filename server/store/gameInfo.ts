import { GameInfo, Room } from "../../client/src/types/IGameData";

type UserMap = Map<string, string>;
type RoomMap = Map<string, Room>;
type GameMap = Map<string, Readonly<GameInfo>>;

export const users: UserMap = new Map();
export const rooms: RoomMap = new Map();
export const gameInfos: GameMap = new Map();
