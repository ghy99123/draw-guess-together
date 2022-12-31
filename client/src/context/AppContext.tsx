import React, { createContext, useReducer } from "react";
import io, { Socket } from "socket.io-client";
import { url } from "../constant/url";
import { IAction } from "../types/IAction";
import { GameInfo, Player, Room } from "../types/IGameData";
import { ClientToServerEvents, ServerToClientEvents } from "../types/ISocket";

interface IAppState {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  player: Player;
  room: Room | null;
  gameInfo: GameInfo;
}

// export type IAction = {
//   type: string;
//   payload: any;
// };

const initialState: IAppState = {
  socket: io(url),
  player: {userName: "", uid: null},
  room: null,
  gameInfo: {
    painter: {userName: "", uid: null},
    painterIndex: 0,
    round: -1,
    totalRound: 0, // each player has 5 chances to paint
    answer: "",
    status: "WAITING",
    correctGuess: 0,
    scores: {},
  },
};

export interface IAppContext {
  state: IAppState;
  dispatch: React.Dispatch<IAction>;
}

const reducer = (state: IAppState, action: IAction): typeof initialState => {
  const { type, payload } = action;
  switch (type) {
    case "update_info":
      return { ...state, player: payload };
    case "update_room":
      return { ...state, room: payload };
    case "update_game_info":
      return {...state, gameInfo: payload};
    default:
      throw new Error();
  }
};

const AppContext = createContext<IAppContext>({
  state: initialState,
  dispatch: () => {},
});

type Props = {
  children?: React.ReactNode;
};

const AppContextProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppContextProvider };
