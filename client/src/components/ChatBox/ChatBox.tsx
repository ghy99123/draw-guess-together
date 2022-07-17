import React, { useEffect, useRef, useState } from "react";
import { Input, InputRef, List } from "antd";
import "./style.css";
import { Message } from "../../types/gameType";

interface Props {
  tooltip: string;
  placeholder: string;
  msgList: Message[];
  onSend?: (e: any) => void;
}

const ChatBox: React.FC<Props> = (props: Props) => {
  const { tooltip, placeholder, msgList, onSend } = props;

  const msgEl = useRef<HTMLDivElement>(null);
  const inputRef = useRef<InputRef>(null);
  const [inputValue, setInputValue] = useState<string>("");

  useEffect(() => {
    if (msgEl.current) {
      // auto scroll to the bottom
      msgEl.current.addEventListener("DOMNodeInserted", (event: any) => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: "smooth" });
      });
    }
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
          dataSource={msgList}
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
