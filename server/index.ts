import { Server } from "socket.io";
import express from "express";
import * as http from "http";
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../client/src/types/ISocket";
import { generateUserId } from "./util/user";
import RandomizedSet from "./util/RandomizedSet";
import { users, rooms, gameInfos } from "./store/gameInfo";
import { GameInfo, Player, Room, Score } from "../client/src/types/IGameData";
import gameWords from "./store/gameWords";

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
      const uid = player.uid as string;
      const curScores = gameInfo.scores;
      const correctGuess = gameInfo.correctGuess;
      const room = rooms.get(roomId) as Room;
      const totalPlayers = room.players.length;
      const score = totalPlayers - correctGuess + curScores[uid].score;
      // player.score = player.score + score;
      const scores: Record<string, Score> = {
        ...curScores,
        [uid]: {player, score}
      }

      const curGameInfo: GameInfo = {
        ...gameInfo,
        correctGuess: correctGuess + 1,
        scores,
      };

      gameInfos.set(roomId, curGameInfo);

      io.in(roomId).emit(
        "message",
        `${player.userName}猜对了答案`,
        "",
        true,
        0
      );

      io.in(roomId).emit("updateScore", curGameInfo);
    } else {
      io.in(roomId).emit("message", guessWord, player.userName, false, 0);
    }
  });

  // Waiting for the admin user starting the game
  socket.on("startGame", (roomId) => {
    type Keyword = [string, string]
    const READ_TIME = 5000;
    const DRAW_TIME = 60000;
    const RESULT_TIME = 5000;
    const TOTAL_TIME = READ_TIME + DRAW_TIME + RESULT_TIME;
 
    const wordSet = new RandomizedSet<Keyword>(gameWords as Keyword[]);

    const startOneRound = (gameInfo: Readonly<GameInfo>) => {
      console.log('score', gameInfo.scores)
      gameInfos.set(roomId, gameInfo);
      io.in(roomId).emit("nextPlay", gameInfo);
      setTimeout(() => {
        const curInfo: Readonly<GameInfo> = {
          ...gameInfo,
          status: "ROUND_START",
        };
        gameInfos.set(roomId, curInfo);
        io.in(roomId).emit("nextPlay", curInfo);
      }, READ_TIME);
      setTimeout(() => {
        const gameInfo = gameInfos.get(roomId) as GameInfo;
        const curInfo: Readonly<GameInfo> = {
          ...gameInfo,
          status: "ROUND_END",
        };
        gameInfos.set(roomId, curInfo);
        io.in(roomId).emit("nextPlay", curInfo);
      }, READ_TIME + DRAW_TIME);
    };

    const room = rooms.get(roomId);
    if (!room) return;

    const initScores: Record<string, Score> = Object.fromEntries(
      room.players.map((player) => [player.uid, { player, score: 0 }])
    );
    const initialInfo: Readonly<GameInfo> = {
      painter: room.players[0],
      painterIndex: 0,
      round: 1,
      totalRound: room.players.length * 5, // each player has 5 chances to paint
      answer: wordSet.getRandom()[0],
      status: "ROUND_BEFORE",
      correctGuess: 0,
      scores: initScores,
    };

    startOneRound(initialInfo);

    let i = 1;
    let timer = setInterval(() => {
      const curGameInfo = gameInfos.get(roomId) as GameInfo;
      const curInfo: Readonly<GameInfo> = {
        ...curGameInfo,
        painter: room.players[i % room.players.length],
        painterIndex: i % room.players.length,
        round: i + 1,
        answer: wordSet.getRandom()[0],
        correctGuess: 0,
        status: "ROUND_BEFORE",
      };
      startOneRound(curInfo);
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
