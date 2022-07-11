import React from "react";
import { List } from "antd";

const list = [
  {id: 1, name: "玩家1", score: 10},
  {id: 2, name: "玩家2", score: 8},
  {id: 3, name: "玩家3", score: 6},
  {id: 4, name: "玩家3", score: 6},
  {id: 5, name: "玩家3", score: 6},
  {id: 6, name: "玩家3", score: 6},
  {id: 7, name: "玩家3", score: 6},
  {id: 8, name: "玩家3", score: 6},
]

export default function UserList() {
  return (
    <>
      <List 
        dataSource={list}
        renderItem={(item: any) => (
          <List.Item key={item.id}>
            <List.Item.Meta 
              title={item.name}
              description={'得分：' + item.score}
            />
            <div>状态</div>
          </List.Item>
        )}
      />
    </>
  );
}
