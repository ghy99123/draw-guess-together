import React from "react";
import { List } from "antd";
import { Player } from "../../types/IGameData";

interface Props {
  players?: Player[];
}

const UserList: React.FC<Props> = (props: Props) => {
  const { players } = props;
  return (
    <>
      <List
        dataSource={players}
        renderItem={(item: Player) => (
          <List.Item key={item.uid}>
            <List.Item.Meta
              title={item.userName}
              description={"得分：" + item.score}
            />
            <div>状态</div>
          </List.Item>
        )}
      />
    </>
  );
};

export default UserList;
