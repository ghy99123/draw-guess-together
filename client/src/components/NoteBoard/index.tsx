import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import "./style.css";

interface Props {}

const NoteBoard: React.FC<Props> = (props: Props) => {
  const { state } = useContext(AppContext);
  const { gameInfo, room, player } = state;
  const status = gameInfo.status;
  const [displayText, setDisplayText] = useState<string>("");

  const isAdmin = room?.admin.uid === player.uid;
  const isPainter = gameInfo.painter.uid === player.uid;

  useEffect(() => {
    let text: string;
    switch (status) {
      case "WAITING":
        text = isAdmin
          ? `准备开始游戏`
          : `请等待${room?.admin.userName}开始游戏`;
        break;
      case "ROUND_BEFORE":
        text = isPainter
          ? `本轮题目: ${gameInfo.answer}`
          : `${gameInfo?.painter.userName}正在看题准备中`;
        break;
      case "ROUND_END":
        text = `本轮答案: ${gameInfo.answer}`;
        break;
      case "GAME_END":
        text = `游戏结束`;
        break;
      default:
        text = "";
        break;
    }
    setDisplayText(text);
  }, [status, room, player]);

  return (
    <div className="noteboard-container">
      <div className="note">{displayText}</div>
    </div>
  );
};

export default NoteBoard;
