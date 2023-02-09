import { requestMessage, verifyMessage } from "./authService";
import { NextFunction, Request, Response } from "express";

export async function request(req: Request, res: Response, next: NextFunction) {
  try {
    const { address } = req.body;

    const message = await requestMessage({
      address,
    });

    res.status(200).json({ message });
  } catch (err) {
    next(err);
  }
}

export async function verify(req: Request, res: Response, next: NextFunction) {
  try {
    const { message, signature, address } = req.body;

    const user = await verifyMessage({
      message,
      signature,
      address,
    });

    res.status(200).json({ user });
  } catch (err) {
    next(err);
  }
}
