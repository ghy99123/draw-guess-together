const app = require("express")();
const http = require("http").createServer(app);
const io = require("socket.io")(http, {
  cors: {
    origin: "http://localhost:3000",
  },
});
const PORT = process.env.PORT || 7000;

io.on("connect", (socket) => {
  console.log("connect");
});

http.listen(PORT, () => console.log(`server ready on port ${PORT}`));
