import { Server } from "socket.io";
import express from "express";
import * as http from "http";
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../client/src/types/ISocket";
import { generateUserId } from "./util/user";
import { users, rooms, gameInfos } from "./store/gameInfo";
import { GameInfo, Player, Room } from "../client/src/types/IGameData";

const app = express();
const httpSever = http.createServer(app);

const io = new Server<ClientToServerEvents, ServerToClientEvents>(httpSever, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const PORT = process.env.PORT || 7002;

io.on("connect", (socket) => {
  console.log("connect");
  // Waiting for a new user coming and assign an id for the user
  socket.on("createUser", (userName) => {
    const uid: string = generateUserId();
    users.set(uid, userName);
    const player = { userName, uid, score: 0 };
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
    io.in(roomId).emit("message", `${player.userName}加入了房间`, "", true, 1);
  });

  // Waiting for a user leaving a goming room and update the room information
  socket.on("leaveRoom", (player, roomId) => {
    // socket.leave(roomId);

    const curRoom = rooms.get(roomId);
    if (!curRoom) return;
    const players =
      curRoom?.players.filter((p: Player) => p.uid !== player.uid) || [];
    rooms.set(roomId, { ...curRoom, players });
    // every player in the room leaves, destroy the room
    if (!players.length) {
      rooms.delete(roomId);
    }
    io.in(roomId).emit("leaveRoom", rooms.get(roomId) as Room);
    io.in(roomId).emit("message", `${player.userName}离开了房间`, "", true, 1);
    socket.leave(roomId);
  });

  socket.on("message", (msg, userName, roomId) => {
    io.in(roomId).emit("message", msg, userName, false, 1);
  });

  socket.on("guess", (guessWord, player, roomId) => {
    const gameInfo = gameInfos.get(roomId) as GameInfo;
    if (guessWord === gameInfo?.answer) {
      io.in(roomId).emit(
        "message",
        `${player.userName}猜对了答案`,
        "",
        true,
        0
      );
    } else {
      io.in(roomId).emit("message", guessWord, player.userName, false, 0);
    }
  });

  // Waiting for the admin user starting the game
  socket.on("startGame", (roomId) => {
    const READ_TIME = 5000;
    const DRAW_TIME = 60000;
    const RESULT_TIME = 5000;
    const TOTAL_TIME = READ_TIME + DRAW_TIME + RESULT_TIME;

    console.log("first")

    const room = rooms.get(roomId);
    if (!room) return;
    const initialInfo: Readonly<GameInfo> = {
      painter: room.players[0],
      painterIndex: 0,
      round: 1,
      totalRound: room.players.length * 5, // each player has 5 chances to paint
      answer: "写死的答案",
      status: "ROUND_BEFORE",
    };
    gameInfos.set(roomId, initialInfo);

    io.in(roomId).emit("nextPlay", initialInfo);
      setTimeout(() => {
        io.in(roomId).emit("nextPlay", { ...initialInfo, status: "ROUND_START" });
      }, READ_TIME);
      setTimeout(() => {
        io.in(roomId).emit("nextPlay", { ...initialInfo, status: "ROUND_END" });
      }, READ_TIME + DRAW_TIME);

    let i = 1;
    let timer = setInterval(() => {
      const curInfo = {
        ...initialInfo,
        painter: room.players[i % room.players.length],
        painterIndex: i % room.players.length,
        round: i + 1,
        answer: "写死的答案" + i,
      };
      io.in(roomId).emit("nextPlay", { ...curInfo, status: "ROUND_BEFORE" });
      setTimeout(() => {
        io.in(roomId).emit("nextPlay", { ...curInfo, status: "ROUND_START" });
      }, READ_TIME);
      setTimeout(() => {
        io.in(roomId).emit("nextPlay", { ...curInfo, status: "ROUND_END" });
      }, READ_TIME + DRAW_TIME);

      // Game ends
      if (curInfo.round === curInfo.totalRound) {
        clearInterval(timer);
        io.in(roomId).emit("nextPlay", { ...curInfo, status: "GAME_END" });
      }
      i++;
    }, TOTAL_TIME);

  });

  // Waiting for the painter drawing on the canvas
  socket.on("draw", (mousePos, newMousePos, color, lineWidth, roomId) => {
    socket.to(roomId).emit("draw", mousePos, newMousePos, color, lineWidth);
  });
});

httpSever.listen(PORT, () => console.log(`server ready on port ${PORT}`));
