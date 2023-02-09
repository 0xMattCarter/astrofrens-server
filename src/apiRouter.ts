import express from "express";
import { authRouter } from "./auth/authRouter";
import { nftRouter } from "./nfts/nftsRouter";
import rateLimit, { MemoryStore } from "express-rate-limit";

const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 30,
  standardHeaders: true,
  store: new MemoryStore(),
});

export const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/nfts", nftRouter);
