import React from "react";
import { List } from "antd";
import { Player, Score } from "../../types/IGameData";

interface Props {
  players?: Player[];
  scores: Score[];
}

const UserList: React.FC<Props> = (props: Props) => {
  const { players, scores } = props;
  // [userName: xxx, uid:xxx]
  // [{[uid]: {player: xxx, }}]

  return (
    <>
      {scores.length ? (
        <List
          dataSource={scores}
          renderItem={(item: Score) => (
            <List.Item key={item.player.uid}>
              <List.Item.Meta
                title={item.player.userName}
                description={"得分：" + item.score}
              />
              <div>状态</div>
            </List.Item>
          )}
        />
      ) : (
        <List
          dataSource={players}
          renderItem={(item: Player) => (
            <List.Item key={item.uid}>
              <List.Item.Meta
                title={item.userName}
                description={"得分：" + 0}
              />
              <div>状态</div>
            </List.Item>
          )}
        />
      )}
    </>
  );
};

export default UserList;
