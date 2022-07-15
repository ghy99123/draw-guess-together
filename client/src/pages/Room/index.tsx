import React, { useContext, useEffect } from "react";
import { Button } from "antd";
import ChatBox from "../../components/ChatBox/ChatBox";
import "./style.css";
import Canvas from "../../components/Canvas";
import UserList from "../../components/UserList/UserList";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";

export default function Room() {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(AppContext);
  const { socket, uid, userName, room } = state;

  const onLeaveRoomClick = () => {
    if (!uid || !room) return;
    socket.emit("leaveRoom", uid, room.roomId);
  };

  console.log("sfs");

  const onMsgSend = (e: any) => {
    // socket.emit("message", )
    if (!room) return;
    const msg: string = e.target.value;
    if (msg.trim() === "") return;
    socket.emit("message", msg, userName, room.roomId);
  };

  useEffect(() => {
    socket.on("leaveRoom", (room) => {
      dispatch({ type: "update_room", payload: null });
      navigate("/", { replace: true });
    });
  }, []);

  return (
    <>
      <div className="wrapper">
        <div className="game-container">
          <div className="user-list-container">
            <UserList />
          </div>
          <div className="canvas-container">
            <Canvas />
          </div>
          <div className="input-area">
            <ChatBox
              isGuess={true}
              tooltip="答案"
              placeholder="请输入答案~"
              socket={socket}
            />
            <div className="divider"></div>
            <ChatBox
              isGuess={false}
              tooltip="聊天"
              placeholder="与朋友聊天～"
              socket={socket}
              onSend={onMsgSend}
            />
            <div className="button-area">
              <Button type="primary" shape="round">
                开始游戏
              </Button>
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
