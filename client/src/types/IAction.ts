import { GameInfo, Player, Room } from "./IGameData";

export type IAction =
  | {
      type: "update_info";
      payload: Player;
    }
  | {
      type: "update_room";
      payload: Room | null;
    }
  | {
      type: "update_game_info";
      payload: GameInfo;
    };
