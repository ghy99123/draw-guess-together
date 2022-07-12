import React, { useContext, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext, IAppContext } from "../../context/AppContext";
import { Player } from "../../types/IGameData";
import "./style.css";

export default function Home() {
  const navigate = useNavigate();
  const formRef = useRef(null);
  const { state, dispatch } = useContext(AppContext);
  const { socket, uid, room, userName } = state;

  const enterRoom = (player: Player) => {
    // TODO: currently roomId is 1745
    console.log(userName, uid);
    socket.emit("enterRoom", player, "1745");
  };

  const onClick = (e: React.SyntheticEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      userName: { value: string };
    };
    const userName = target.userName.value;
    if (userName.trim() === "") {
      console.log("无效用户名");
      return;
    }
    if (uid === null) {
      socket.emit("createUser", userName);
    } else {
      enterRoom({ userName, uid });
    }
  };

  useEffect(() => {
    socket.on("getUserInfo", (player) => {
      dispatch({ type: "update_info", payload: player });
      enterRoom(player);
    });

    socket.on("enterRoom", (room) => {
      dispatch({ type: "update_room", payload: room });
      navigate(`/room/${room.roomId}`, {replace: true});
    });
  }, []);

  return (
    <>
      <div className="container">
        <form className="login-form" ref={formRef} onSubmit={onClick}>
          <h2>欢迎登录</h2>
          <input type="text" name="userName" placeholder="请随意输入玩家名称" />
          {/* <input name="roomId" placeholder="请输入房间号" /> */}
          <button type="submit">加入</button>
        </form>
      </div>
    </>
  );
}
