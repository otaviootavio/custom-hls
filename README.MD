# Eth-PayWord: Decentralized Video Streaming with Micropayments

## Project Overview

Eth-PayWord is a decentralized video streaming platform that implements micropayments using the PayWord protocol on the Ethereum blockchain. This project aims to provide a secure, efficient, and fair method for content creators to monetize their video content while offering viewers a seamless streaming experience.

## Repository Structure

The project is divided into several main components:

1. **debug-web-extension**: Contains the smart contract and frontend for the PayWord protocol implementation.
2. **vite-web-extension**: A browser extension for managing hash chains.
3. **vendor-api**: A utility for converting MP4 files to HLS format.
4. **hardhat**: The main application for video streaming and payment processing.

```bash
.
├── docker-compose.yml
├── debug-web-extension
│   ├── frontend
│   │   └── [...] // dApp file (static frontend)
│   └──── hardhat
│       ├── [...] // All the smart contract development files
│       └──README.MD
├── vite-web-extension
│   ├── README.md
│   └──── src
│         └── [...] // Extension files
├── hardhat
│   └── [...] // Extension files
├── vendor-api
│   ├── hls
|   |   └── [...] // All the HLS video segments
│   └── README.md
|       └── [...] // All the HLS video segments
└── README.MD
```

## Setup and Installation

### Prerequisites

- Node.js (v18 or later)
- pnpm
- Docker and Docker Compose

### Installation Steps

1. Clone the repository.

2. Start the Docker containers:

```bash
docker-compose up -d
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

Setup the environment variables in the `.env` file in debug-web-extension and vendor-api directorys

### Smart Contract Deployment

1. Navigate to the `hardhat` directory.
2. Run tests and deploy the contract:

```bash
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
-- add a value for each hash
-- add the chain ID

5. Start the route for the API

```bash
pnpm dev
```

## Features

- Video streaming using HLS
- Micropayments implementation with PayWord protocol
- Browser extension for managing hash chains
- Smart contract for handling payments

## To dos

- [] Store hls video segment to a bucket
- [] Create a monorepo
- [] Add chadcn/ui( or other ui components )
- [] Add dark and light mode
- [] Perhaps there is no need to use background + content script
