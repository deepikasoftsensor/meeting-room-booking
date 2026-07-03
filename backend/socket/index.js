const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_ORIGIN || "*",
      credentials: true,
    },
  });

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("No token"));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error("Unauthorized"));
      }

      socket.user = {
        id: user._id.toString(),
        companyId: user.companyId.toString(),
        name: user.name,
      };

      next();
    } catch (err) {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket) => {
    const { companyId, id, name } = socket.user;

    socket.join(companyId);

    io.to(companyId).emit("user:online", {
      userId: id,
      name,
    });

    socket.on("disconnect", () => {
      io.to(companyId).emit("user:offline", {
        userId: id,
        name,
      });
    });
  });

  return io;
}

module.exports = {
  initSocket,
};