import {
  getNftFloorPrice,
  getUserNfts,
  getUserNftsSingleReq,
} from "./nftsService";
import { NextFunction, Request, Response } from "express";

export async function nftsInCollectionController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const address = req.query.address as string;
    const tokenAddresses = req.query.tokenAddress as string;

    const nfts = await getUserNfts({
      address,
      tokenAddresses,
    });

    res.status(200).json({ nfts });
  } catch (err) {
    next(err);
  }
}

export async function nftsInCollectionControllerSingleReq(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const address = req.query.address as string;
    const tokenAddresses = req.query.tokenAddress as string;
    const cursor = req.query.cursor as string;

    const nfts = await getUserNftsSingleReq({
      address,
      tokenAddresses,
      cursor,
    });

    res.status(200).json({ nfts });
  } catch (err) {
    next(err);
  }
}

export async function nftsFloorPriceController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const address = req.query.address as string;

    const floor = await getNftFloorPrice({
      address,
    });

    res.status(200).json({ floor });
  } catch (err) {
    next(err);
  }
}
