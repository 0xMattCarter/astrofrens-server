# Parse Server using Moralis Web3Auth

## Notes

- This code is built on a clone of Moralis's demo parse server repo here https://github.com/MoralisWeb3/Moralis-JS-SDK/tree/main/demos/parse-server

## Running the backend

- run `npm run dev` to start the backend on port 1337

## Deployment

- Set .env variables like in `.env.example`
- Host site on aws (or other platform)
- Once there is a URL for the now hosted backend, update the .env `SERVER_URL` variable
- Last step is to update URL on frontend
