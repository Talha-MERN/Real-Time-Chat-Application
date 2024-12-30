const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");
const expressFormidable = require("express-formidable");
const cookieParser = require("cookie-parser");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

dotenv.config();

const app = express();

const corsOptions = {
  origin:
    process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://rtc-by-talha.com",
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());

app.use("/api/v1/user", expressFormidable(), userRoutes);
app.use("/api/v1/chat", chatRoutes);
app.use("/api/v1/message", messageRoutes);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");

    const server = app.listen(PORT, () => {
      console.log(`Server has started at PORT:${PORT}`);
    });

    const io = require("socket.io")(server, {
      pingTimeout: 60000,
      cors: {
        origin:
          process.env.NODE_ENV === "development"
            ? "http://localhost:3000"
            : "https://rtc-by-talha.com",
      },
    });

    io.on("connection", (socket) => {
      console.log("Connected to Socket.IO");

      socket.on("setup", (userData) => {
        if (!userData || !userData._id) {
          console.error("Invalid user data received in setup.");
          return;
        }
        socket.join(userData._id);
        console.log(`User connected: ${userData._id}`);
        socket.emit("connected");
      });

      socket.on("join chat", (room) => {
        if (!room) {
          console.error("Invalid room ID.");
          return;
        }
        socket.join(room);
        console.log(`User joined room: ${room}`);
      });

      socket.on("new message", (newMessageRecieved) => {
        const chat = newMessageRecieved?.chat;
        if (!chat?.users) {
          console.error("chat.users not defined");
          return;
        }

        chat.users.forEach((user) => {
          if (user._id === newMessageRecieved.sender._id) return;
          socket.to(user._id).emit("message received", newMessageRecieved);
        });
      });
    });
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }
};

startServer();

//////////////////////////////////////////////////////////////////////////////////////////////////////////

// const express = require("express");
// const app = express();
// const dotenv = require("dotenv");
// const cors = require("cors");
// const connectDB = require("./config/db");
// const expressFormidable = require("express-formidable");
// const cookieParser = require("cookie-parser");

// const userRoutes = require("./routes/userRoutes");
// const chatRoutes = require("./routes/chatRoutes");
// const messageRoutes = require("./routes/messageRoutes");

// const corsOptions = {
//   origin:
//     process.env.NODE_ENV === "development"
//       ? "http://localhost:3000"
//       : "https://rtc-by-talha.com",
//   credentials: true,
// };

// // app.use(expressFormidable());
// dotenv.config();
// app.options("*", cors(corsOptions));
// app.use(cors(corsOptions));
// app.use(cookieParser());
// app.use(express.json());
// // app.use(cors());

// app.use("/api/v1/user", expressFormidable(), userRoutes);
// app.use("/api/v1/chat", chatRoutes);
// app.use("/api/v1/message", messageRoutes);

// const PORT = process.env.PORT || 5000;

// const server = app.listen(PORT, () => {
//   console.log(`Server has started at PORT:${PORT}`);
//   connectDB();
// });

// const io = require("socket.io")(server, {
//   pingTimeout: 60000,
//   cors: {
//     origin: "http://localhost:3000",
//   },
// });

// io.on("connection", (socket) => {
//   console.log("connected to socket.io");

//   socket.on("setup", (userData) => {
//     socket.join(userData._id);
//     console.log("user data" + typeof userData._id);
//     socket.emit("connected");
//   });

//   socket.on("join chat", (room) => {
//     socket.join(room);
//     console.log("User joined the room:" + typeof room);
//   });

//   socket.on("new message", (newMessageRecieved) => {
//     var chat = newMessageRecieved.chat;
//     console.log("chat" + chat);

//     if (!chat.users) return console.log("chat.users not defined");

//     chat.users.forEach((user) => {
//       if (user._id == newMessageRecieved.sender._id) return;

//       socket.in(user._id).emit("message recieved", newMessageRecieved);
//     });
//   });
// });
