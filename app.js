const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
app.use(express.json());

const userRoutes = require("./route/user");
const messageRoutes = require("./route/message");
const Message = require("./model/message");

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

const createRoomId = (user1, user2) => [user1, user2].sort().join("_");

io.on("connection", (socket) => {
  console.log("✅ Client connected:", socket.id);

  socket.on("CREATE_PERSONAL_ROOM", ({ sender, receiver }) => {
    const RoomId = createRoomId(sender, receiver);
    socket.join(RoomId); // join the room
    console.log(`✅ Socket ${socket.id} joined room ${RoomId}`);
  });

  socket.on("SEND_PERSONAL_MESSAGE", async ({ sender, receiver, message }) => {
    try {
      const newMessage = await Message.create({ sender, receiver, message });
      const RoomId = createRoomId(sender, receiver);

      // use ONE clear event name
      io.to(RoomId).emit("RECEIVE_PERSONAL_MESSAGE", newMessage);
    } catch (err) {
      console.error("❌ Error saving message:", err);
      socket.emit("errorMessage", err.message);
    }
  });

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

app.get("/", (req, res) => {
  res.send("Hello Socket.IO!");
});

module.exports = server;
