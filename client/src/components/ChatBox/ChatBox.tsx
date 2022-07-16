import React, { useEffect, useRef, useState } from "react";
import { Input, InputRef, List } from "antd";
import "./style.css";
import { Socket } from "socket.io-client";
import {
  ClientToServerEvents,
  ServerToClientEvents,
} from "../../types/ISocket";

interface Props {
  isGuess: boolean;
  tooltip: string;
  placeholder: string;
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  onSend?: (e: any) => void;
}

type Message = {
  msg: string;
  color: string;
};

const ChatBox: React.FC<Props> = (props: Props) => {
  const { tooltip, placeholder, socket, onSend, isGuess } = props;

  const msgEl = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState<string>("");
  const [chatList, setChatList] = useState<Message[]>([]);
  const [guessList, setGuessList] = useState<Message[]>([]);
  const inputRef = useRef<InputRef>(null);

  console.log("set");

  useEffect(() => {
    if (msgEl.current) {
      // auto scroll to the bottom
      msgEl.current.addEventListener("DOMNodeInserted", (event: any) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }

    socket.on("message", (msg, userName, isSystemMsg, msgType) => {
      const newMsg = isSystemMsg ? msg : `${userName}: ${msg}`;
      const color = isSystemMsg ? "green" : "#4f251a";
      const msgItem = { msg: newMsg, color };
      msgType === 1
        ? setChatList((preList) => [...preList, msgItem])
        : setGuessList((preList) => [...preList, msgItem]);
    });
  }, []);

  const onPressEnter = (e: any) => {
    setInputValue("");
    if (typeof onSend === "function") {
      onSend(e);
    }
  };

  return (
    <div className="chat-box-container">
      <div className="tooltip">{tooltip}</div>
      <div className="message-box" ref={msgEl}>
        <List
          dataSource={isGuess ? guessList : chatList}
          split={false}
          size="small"
          renderItem={(item, index) => (
            <List.Item key={index}>
              <span style={{ color: item.color }}>{item.msg}</span>
            </List.Item>
          )}
        />
      </div>
      <Input
        placeholder={placeholder}
        onPressEnter={onPressEnter}
        ref={inputRef}
        value={inputValue}
        onChange={(e) => {
          setInputValue(e.target.value);
        }}
      />
    </div>
  );
};

export default ChatBox;
