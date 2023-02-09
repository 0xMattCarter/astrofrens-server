import Moralis from "moralis";
import { authRequests } from "../store";
import { ParseServerRequest } from "../utils/ParseServerRequest";

const serverRequest = new ParseServerRequest();

/// Interfaces
interface ParseUser {
  objectId: string;
}

export interface RequestMessage {
  address: string;
  chain: string;
  network: string;
}

export interface VerifyMessage {
  network: string;
  signature: string;
  message: string;
  address: string;
}

const DOMAIN = "AstroFrens";
const STATEMENT = "Please sign this message to confirm your identity.";
const URI = "https://grill.astrofrens.com";
const EXPIRATION_TIME = "2030-01-01T00:00:00.000Z";
const TIMEOUT = 15;

/**
 * Requests a message to sign from Moralis
 * @param address The address to request a message for
 * @returns  The message to sign
 */
export async function requestMessage({ address }: { address: string }) {
  try {
    const result = await Moralis.Auth.requestMessage({
      address,
      chain: "0x1",
      network: "evm",
      domain: DOMAIN,
      statement: STATEMENT,
      uri: URI,
      expirationTime: EXPIRATION_TIME,
      timeout: TIMEOUT,
    });

    const { message, id, profileId } = result.toJSON();

    authRequests.set(message, { id, profileId });

    return message;
  } catch (error) {
    console.log(`Error requesting message from Moralis, ${address}\n`, error);
  }
}

/**
 * Verifies that `message` was signed by `address` using `signature` then logs in the user
 * @param signature The signature to verify the message
 * @param message The message to be verified
 * @param address The address attempting to verify the message
 * @returns The user that was logged in
 */
export async function verifyMessage({
  signature,
  message,
  address,
}: {
  signature: string;
  message: string;
  address: string;
}) {
  try {
    const storedData = authRequests.get(message);

    if (!storedData) {
      throw new Error("Invalid message");
    }

    const { id: storedId, profileId: storedProfileId } = storedData;

    const authData = {
      id: storedProfileId,
      authId: storedId,
      message,
      signature,
      network: "evm",
    };

    // Authenticate
    const user = await serverRequest.post<ParseUser>({
      endpoint: `/users`,
      params: {
        authData: {
          moralis: authData,
        },
      },
      useMasterKey: true,
    });

    // Update user moralisProfile column
    await serverRequest.put({
      endpoint: `/users/${user.objectId}`,
      params: {
        moralisProfileId: storedProfileId,
        ethAddress: address.toLowerCase(),
      },
      useMasterKey: true,
    });

    return user;
  } catch (error) {
    console.log(
      `Error verifying signature with Moralis, ${message}, ${signature}, ${address}\n`,
      error
    );
  }
}
