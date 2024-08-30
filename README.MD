# Eth-PayWord: Decentralized Video Streaming with Micropayments

## Project Overview

Eth-PayWord is a decentralized video streaming platform that implements micropayments using the PayWord protocol on the Ethereum blockchain. This project aims to provide a secure, efficient, and fair method for content creators to monetize their video content while offering viewers a seamless streaming experience.

## Repository Structure

The project is divided into several main components:

1. **eth-payword**: Contains the smart contract and frontend for the PayWord protocol implementation.
2. **extension**: A browser extension for managing hash chains.
3. **mp4-to-hls**: A utility for converting MP4 files to HLS format.
4. **my-hls-app**: The main application for video streaming and payment processing.

```bash
.
├── docker-compose.yml
├── eth-payword
│   ├── frontend
│   │   └── [...] // dApp file (static frontend)
│   └──── hardhat
│       ├── [...] // All the smart contract development files
│       └──README.MD
├── extension
│   ├── README.md
│   └──── src
│         └── [...] // Extension files
├── mp4-to-hls
│   └── [...] // Extension files
├── my-hls-app
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
cd eth-payword/frontend
pnpm install
cd ../hardhat
pnpm install
cd ../../extension
pnpm install
cd ../my-hls-app
pnpm install
```

## Usage

Setup the environment variables in the `.env` file.

### Smart Contract Deployment

1. Navigate to the `eth-payword/hardhat` directory.
2. Run tests and deploy the contract:

```bash
pnpm test
pnpm run deploy
```

### Frontend Development

1. Navigate to the `eth-payword/frontend` directory.
2. Start the development server:

```bash
pnpm dev
```

### Browser Extension ( currently Chrome only )

1. Navigate to the `extension` directory.
2. Build the extension:

```bash
pnpm build
```

3. Load the built extension in your browser's developer mode.

### Video Streaming Application

1. Navigate to the `my-hls-app` directory.
2. Start the development server:

```bash
pnpm dev
```

## Features

- Video streaming using HLS
- Micropayments implementation with PayWord protocol
- Browser extension for managing hash chains
- Smart contract for handling payments
