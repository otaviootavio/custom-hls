# Eth-PayWord: Decentralized Video Streaming with Micropayments

## Project Overview

Eth-PayWord is a decentralized video streaming platform that implements micropayments using the PayWord protocol on the Ethereum blockchain. This project aims to provide a secure, efficient, and fair method for content creators to monetize their video content while offering viewers a seamless streaming experience.

## Repository Structure

The project is divided into several main components:

1. **debug-web-extension**: Contains the frontend for the PayWord protocol implementation.
2. **vite-web-extension**: A browser extension for managing hash chains.
3. **vendor-api**: Contains the routes of the VendorApi and Middleware.
4. **hardhat**: The main application for video streaming and payment processing.

```bash
.
├── docker-compose.yml
├── debug-web-extension
│   ├── frontend
│   │   └── [...] // dApp file (static frontend)
│       └──README.MD
├── vite-web-extension
│   ├── README.md
│   └──── src
│         └── [...] // Extension files
├── hardhat
│   └── [...] // Contract files and tests
├── vendor-api
│   ├── src
|       └── [...] // API Files
│   └── README.md
└── README.MD
```

## Setup and Installation

### Prerequisites

- Node.js (v20.17.0 or later)
- pnpm (v9.11.0 or later) or npm (v10.8.2 or later)
- Docker and Docker Compose (v28.0.0 or later, build f9ced58)

### Installation Steps

1. Clone the repository.

2. Start the Docker containers: (This will be the postgres database, ensure that the port 5432 is free)

```bash
cd vendor-api
docker compose up -d 
```

3. Navigate to each project directory and install dependencies:

```bash
cd debug-web-extension
pnpm install
cd ../hardhat
pnpm install
cd vite-web-extension
pnpm install
cd vendor-api
pnpm install
```

## Usage


### Environment variables (In the folders exists a .env.example that you can copy)

1. Setup a CDN that supports video stream, example : "https://bunny.net/".
2. Deactivate security measurements in the configurations to run in the local host.
3. update a low resolution video to stream.
4. Get the videoID and HLS Playlist URL to put in the frontend and vendor-api .env .
5. Setup the rest of the variables that depends of the database route and vendorID


### Smart Contract Development

1. Navigate to the `hardhat` directory.
2. Run tests and deploy the contract:

```bash
pnpm i
pnpm test
pnpm run deploy
```

### Frontend Development

1. Navigate to the `debug-web-extension` directory.
2. Start the development server:

```bash
pnpm dev
```

### Browser Extension ( currently Chrome only )

1. Navigate to the `vite-web-extension` directory.
2. Build the extension:

```bash
pnpm build
```

3. Load the built extension in your browser's developer mode.

### Server API

1. Navigate to the `vendor-api` directory.
2. Generate the database tables:

```bash
npx prisma generate
```

3. Push the tables to the database

```bash
npx prisma db push
```

4. Go to the prisma studio and add a vendor record

```bash
npx prisma studio
```

-- add a metamask address in the address section
-- add a value in ETH for each hash
-- add the chain ID

5. Start the route for the API

```bash
pnpm dev
```

