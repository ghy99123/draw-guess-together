import React, { createContext, useReducer } from "react";
import io, { Socket } from "socket.io-client";
import { url } from "../constant/url";
import { IAction } from "../types/IAction";
import { Room } from "../types/IGameData";
import { ClientToServerEvents, ServerToClientEvents } from "../types/ISocket";

interface IAppState {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  userName: string;
  uid: string | null;
  onlineCount: number;
  room: Room | null;
 
}

// export type IAction = {
//   type: string;
//   payload: any;
// };

const initialState: IAppState = {
  socket: io(url),
  userName: "",
  uid: null,
  onlineCount: 0,
  room: null
};

export interface IAppContext {
  state: IAppState;
  dispatch: React.Dispatch<IAction>;
}

const reducer = (state: IAppState, action: IAction): typeof initialState => {
  const { type, payload } = action;
  switch (type) {
    case "update_info":
      console.log("reducer", state, payload)
      return { ...state, ...payload };
    case "update_room":
      return { ...state, room: payload};
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
