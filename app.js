import express from "express";
import { config } from "dotenv";
import cors from "cors";

const app = express();
config({
  path: "./config/config.env",
});

app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

import { ErrorMiddleware } from "./middlewares/Error.js";
import cookieParser from "cookie-parser";

app.use(cookieParser());

import authRouter from "./routes/authRouter.js";


app.use("/api/v1", authRouter);


app.get("/", (req, res) => {
  res.send(`Backend Working`);
});

app.use(ErrorMiddleware);

export default app;
