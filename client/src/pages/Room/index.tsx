import React, { useContext, useEffect, useState } from "react";
import { Button } from "antd";
import ChatBox from "../../components/ChatBox/ChatBox";
import "./style.css";
import Canvas from "../../components/Canvas";
import UserList from "../../components/UserList/UserList";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { GameInfo } from "../../types/IGameData";
import { Message } from "../../types/gameType";

export default function Room() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(AppContext);
  const { socket, player, room, gameInfo } = state;
  const { uid, userName } = player;
  const canStart = room !== null && room.players.length > 1;
  const isAdmin = room?.admin?.uid === uid;

  const [start, setStart] = useState<boolean>(false);
  const [chatList, setChatList] = useState<Message[]>([]);
  const [guessList, setGuessList] = useState<Message[]>([]);

  const onLeaveRoomClick = () => {
    if (!uid || !room) return;
    socket.emit("leaveRoom", player, room.roomId);
    navigate("/", { replace: true });
  };

  console.log("sfs");

  const onMsgSend = (e: any) => {
    // socket.emit("message", )
    if (!room) return;
    const msg: string = e.target.value;
    if (msg.trim() === "") return;
    socket.emit("message", msg, userName, room.roomId);
  };

  const onGuessSend = (e: any) => {
    if (!room) return;
    const msg: string = e.target.value.trim();
    if (msg === "") return;
    socket.emit("guess", msg, player, room.roomId);
  };

  const onStartClick = () => {
    if (!room) return;
    socket.emit("startGame", room.roomId);
    setStart(true);
  };

  useEffect(() => {
    socket.on("leaveRoom", (room) => {
      dispatch({ type: "update_room", payload: room });
    });
    socket.on("nextPlay", (gameInfo: GameInfo) => {
      dispatch({ type: "update_game_info", payload: gameInfo });
    });

    socket.on("message", (msg, userName, isSystemMsg, msgType) => {
      const newMsg = isSystemMsg ? msg : `${userName}: ${msg}`;
      const color = isSystemMsg ? "green" : "#4f251a";
      const msgItem = { msg: newMsg, color };
      msgType === 1
        ? setChatList((preList) => [...preList, msgItem])
        : setGuessList((preList) => [...preList, msgItem]);
    });
  }, []);

  return (
    <>
      <div className="wrapper">
        <div className="game-container">
          <div className="user-list-container">
            <UserList players={room?.players} />
          </div>
          <div className="canvas-container">
            <Canvas />
          </div>
          <div className="input-area">
            <ChatBox
              tooltip="答案"
              placeholder="请输入答案~"
              msgList={guessList}
              onSend={onGuessSend}
            />
            <div className="divider"></div>
            <ChatBox
              tooltip="聊天"
              placeholder="与朋友聊天～"
              msgList={chatList}
              onSend={onMsgSend}
            />
            <div className="button-area">
              {isAdmin && !start && (
                <Button
                  type="primary"
                  shape="round"
                  disabled={!canStart}
                  onClick={onStartClick}
                >
                  开始游戏
                </Button>
              )}
              <Button shape="round" onClick={onLeaveRoomClick}>
                离开房间
              </Button>
            </div>
          </div>
          {/* <div className="tool-container"></div> */}
        </div>
      </div>
    </>
  );
}
