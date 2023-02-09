import express from "express";
import {
  nftsInCollectionController,
  nftsFloorPriceController,
  nftsInCollectionControllerSingleReq,
} from "./nftsController";

export const nftRouter = express.Router();

nftRouter.route("/in-collection").get(nftsInCollectionController);
nftRouter
  .route("/in-collection-single-req")
  .get(nftsInCollectionControllerSingleReq);
nftRouter.route("/floor-price").get(nftsFloorPriceController);
