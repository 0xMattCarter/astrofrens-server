import Moralis from "moralis";
import { ParseServerRequest } from "../utils/ParseServerRequest";

/// Interfaces
export interface RequestMessage {
  address: string;
  chain: string;
  network: string;
}

/**
 * Gets a user's nfts for a specific collection (auto-paginates and gets all)
 * @param address The address to get nfts for
 * @param tokenAddresses The token address of the collection
 * @returns The nfts
 */
export async function getUserNfts({
  address,
  tokenAddresses,
}: {
  address: string;
  tokenAddresses: string;
}) {
  var allNfts: any = [];

  try {
    let cursor = null;
    do {
      const response: any = (
        await Moralis.EvmApi.nft.getWalletNFTs({
          address: address.toLowerCase(),
          chain: "0x1",
          tokenAddresses: [tokenAddresses],
          cursor,
          limit: 100,
        })
      ).toJSON();

      allNfts = allNfts.concat(response.result);

      cursor = response.cursor;
    } while (cursor != "" && cursor != null);

    return allNfts;
  } catch (e) {
    console.log(
      `Error requesting nfts from Moralis, ${address} ${tokenAddresses} \n`,
      e
    );
  }
}

/**
 * Gets a user's nfts for a specific collection (limit of 100 per request)
 * @param address The address to get nfts for
 * @param tokenAddresses The token address of the collection
 * @returns The nfts
 */
export async function getUserNftsSingleReq({
  address,
  tokenAddresses,
  cursor = "",
}: {
  address: string;
  tokenAddresses: string;
  cursor: string;
}) {
  try {
    const response: any = (
      await Moralis.EvmApi.nft.getWalletNFTs({
        address: address.toLowerCase(),
        chain: "0x1",
        tokenAddresses: [tokenAddresses],
        limit: 100,
        cursor,
      })
    ).toJSON();

    return response;
  } catch (e) {
    console.log(
      `Error requesting nfts from Moralis, ${address} ${tokenAddresses} \n`,
      e
    );
  }
}

/**
 * Gets the floor price for an nft collection
 * Check varying time periods to get the most recent price
 * @param address The address to get nfts for
 * @param tokenAddresses The token address of the collection
 * @returns The nfts
 */
export async function getNftFloorPrice({ address }: { address: string }) {
  try {
    const chain = "0x1";
    var response: any;

    response = await Moralis.EvmApi.nft.getNFTLowestPrice({
      address,
      chain,
      days: 1,
    });

    const query = [1, 3, 7, 14, 30, 60, 90, 180, 365];

    for (let i = 0; i < query.length; i++) {
      console.log("querying for ", query[i], " days");
      response = await Moralis.EvmApi.nft.getNFTLowestPrice({
        address,
        chain,
        days: query[i],
      });

      /// if we get a response, break out of the loop
      if (response != null) {
        console.log("found floor price");
        break;
      }

      /// if we get to the end of the loop and still no response, return null
      if (i == query.length - 1) {
        console.log("no floor price found");
        throw new Error("no floor price found for nft in previous 365 days");
      }
    }

    return response;
  } catch (e) {
    console.log(
      `Error requesting nft floor price with moralis, ${address} \n`,
      e
    );
  }
}
