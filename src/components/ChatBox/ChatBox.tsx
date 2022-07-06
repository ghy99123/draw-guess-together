import React from "react";
import { Input, List } from "antd";
import "./style.css";

interface Props {
  tooltip: string;
  placeholder: string;
}

const ChatBox: React.FC<Props> = (props: Props) => {
  const { tooltip, placeholder } = props;

  const list: any = []
  
  return (
    <div className="chat-box-container">
      <div className="tooltip">{tooltip}</div>
      <div className="message-box">
        <List
          dataSource={list}
          split={false}
          size="small"
          renderItem={(item: any) => (
            <List.Item key={item.id}>{item.value}</List.Item>
          )}
        />
      </div>
      <Input placeholder={placeholder} />
    </div>
  );
};

export default ChatBox;
