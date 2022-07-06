import React, { createContext, useReducer } from "react";
import io, { Socket } from "socket.io-client";
import { url } from "../constant/url";

interface IAppState {
  socket: Socket;
  userName: string;
  onlineCount: number;
  roomId: number | null;
}

export type IAction = {
  type: string;
};

const initialState: IAppState = {
  socket: io(url),
  userName: "",
  onlineCount: 0,
  roomId: null,
};

interface IAppContext {
  state: IAppState;
  dispatch: React.Dispatch<IAction>;
}

const reducer = (state: IAppState, action: IAction): typeof initialState => {
  const { type } = action;
  switch (type) {
    case "something":
      return state;
    default:
      throw new Error();
  }
};

const AppContext = createContext<IAppContext | null>(null);

type Props = {
  children?: React.ReactNode;
};

const AppContextProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const value = { state, dispatch };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export { AppContext, AppContextProvider };
