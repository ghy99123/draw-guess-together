import { Room } from "../../client/src/types/IGameData";

type UserInfo = Map<string, string>;
type RoomInfo = Map<string, Room>;

export const users: UserInfo = new Map();
export const rooms: RoomInfo = new Map();
