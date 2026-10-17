const path = require("path");

require("dotenv").config({
  path: path.join(__dirname, ".env"),
  quiet: true,
});

const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const Todo = require("./models/todo");
const User = require("./models/user");
const authRouter = require("./routes/authRouter");
const todoRouter = require("./routes/todoRouter");

const app = express();
const PORT = Number(process.env.PORT) || 5000;
let connectionPromise;

async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI 환경 변수가 없습니다.");
  }

  if (!connectionPromise) {
    connectionPromise = mongoose
      .connect(process.env.MONGODB_URI)
      .then(async (connection) => {
        await Promise.all([User.init(), Todo.init()]);
        return connection;
      })
      .catch((error) => {
        connectionPromise = undefined;
        throw error;
      });
  }

  return connectionPromise;
}

app.use(express.json());
app.use(cookieParser());

app.use("/api", async (req, res, next) => {
  if (!process.env.JWT_SECRET) {
    return res.status(500).json({ message: "JWT_SECRET 환경 변수가 없습니다." });
  }

  try {
    await connectToDatabase();
    return next();
  } catch (error) {
    console.error("MongoDB 연결 실패:", error.message);
    return res.status(503).json({ message: "데이터베이스에 연결하지 못했습니다." });
  }
});

app.use("/api/auth", authRouter);
app.use("/api/todos", todoRouter);

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});

async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`서버가 ${PORT}번 포트에서 실행 중입니다.`);
    });
  } catch (error) {
    console.error("서버 시작 실패:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = app;
