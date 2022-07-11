import { Server, Socket } from "socket.io";
import express from "express";
import * as http from "http";
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../client/src/types/ISocket";
import { generateUserId } from "./util/user";
import { users, rooms } from "./store/gameInfo";
import { Room } from "../client/src/types/IGameData";

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

  // Waiting for a user coming into a goming room and updatae the room information
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
    io.in(roomId).emit("enterRoom", rooms.get(roomId) as Room)
  });
});

httpSever.listen(PORT, () => console.log(`server ready on port ${PORT}`));
