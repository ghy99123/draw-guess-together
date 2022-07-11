import React from "react";
import { Button} from "antd";
import ChatBox from "../../components/ChatBox/ChatBox";
import "./style.css";
import Canvas from "../../components/Canvas";
import UserList from "../../components/UserList/UserList";


export default function Room() {
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
            <ChatBox tooltip="答案" placeholder="请输入答案~"/>
            <div className="divider"></div>
            <ChatBox tooltip="聊天" placeholder="与朋友聊天～"/>
            <div className="button-area">
              <Button type="primary" shape="round">开始游戏</Button>
              <Button shape="round">离开房间</Button>
            </div>
          </div>
          {/* <div className="tool-container"></div> */}
        </div>
      </div>
    </>
  );
}
