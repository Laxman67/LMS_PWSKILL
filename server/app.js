import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { config } from "dotenv";
import morgan from "morgan";
config();
import userRouter from "./routes/user.routes.js";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(morgan("dev"));

app.use("/ping", (req, res) => {
  res.status(200).send("Pong");
});

// routes of 3 modules
app.use("/api/v1/user", userRouter);

app.all("*", (req, res) => {
  res.status(404).send("OOPs .. Page not Found");
});

// app.use(errorMiddleware);

export default app;
