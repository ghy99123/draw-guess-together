import { Server } from "socket.io";
import express from "express";
import * as http from "http";
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../client/src/types/ISocket";
import { generateUserId } from "./util/user";
import { users, rooms, gameInfo } from "./store/gameInfo";
import { GameInfo, Player, Room } from "../client/src/types/IGameData";

const app = express();
const httpSever = http.createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpSever, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const PORT = process.env.PORT || 7000;

io.on("connect", (socket) => {
  console.log("connect");
  // Waiting for a new user coming and assign an id for the user
  socket.on("createUser", (userName) => {
    const uid: string = generateUserId();
    users.set(uid, userName);
    const player = { userName, uid };
    socket.emit("getUserInfo", player);
  });

  // Waiting for a user coming into a gaming room and update the room information
  socket.on("enterRoom", async (player, roomId) => {
    await socket.join(roomId);
    const curRoom = rooms.get(roomId);
    if (!curRoom) {
      rooms.set(roomId, {
        players: [player],
        roomId,
        admin: player,
      });
    } else {
      const players = [...curRoom.players, player];
      rooms.set(roomId, { ...curRoom, players });
    }
    // const room = io.of(`/${roomId}`).adapter.rooms;
    // console.log("server", room);
    io.in(roomId).emit("enterRoom", rooms.get(roomId) as Room);
    io.in(roomId).emit("message", `${player.userName}加入了房间`, "", true);
  });

  // Waiting for a user leaving a goming room and update the room information
  socket.on("leaveRoom", (player, roomId) => {
    // socket.leave(roomId);

    const curRoom = rooms.get(roomId);
    if (!curRoom) return;
    const players = curRoom?.players.filter((p: Player) => p.uid !== player.uid) || [];
    rooms.set(roomId, { ...curRoom, players });
    // every player in the room leaves, destroy the room
    if (!players.length) {
      rooms.delete(roomId);
    }
    io.in(roomId).emit("leaveRoom", rooms.get(roomId) as Room);
    io.in(roomId).emit("message", `${player.userName}离开了房间`, "", true);
    socket.leave(roomId);
  });

  socket.on("message", (msg, userName, roomId) => {
    io.in(roomId).emit("message", msg, userName, false);
  });

  // Waiting for the admin user starting the game
  socket.on("startGame", (roomId) => {
    const room = rooms.get(roomId);
    if (!room) return;
    const initialInfo: Readonly<GameInfo> = {
      painter: room.players[0],
      painterIndex: 0,
      room: room,
      round: 1,
      totalRound: room.players.length * 5, // each player has 5 chances to paint
      answer: "写死的答案",
    };
    gameInfo.set(roomId, initialInfo);
    io.in(roomId).emit("nextPlay", initialInfo);
  });
});

httpSever.listen(PORT, () => console.log(`server ready on port ${PORT}`));
