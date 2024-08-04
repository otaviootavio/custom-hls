// src/pages/index.tsx

import React from "react";
import { NextPage } from "next";
import Head from "next/head";
import { HashChainProvider } from "@/context/HashChainContext";
import HashChainManager from "@/components/HashChainManager";
import VideoPlayer from "@/components/VideoPlayer";
import PaywordManager from "@/components/PaywordManager";
import { HashChainExtensionProvider } from "@/context/HashChainExtensionProvider";

const Home: NextPage = () => {
  return (
    <HashChainExtensionProvider>
      <HashChainProvider>
        <div>
          <Head>
            <title>Custom HLS</title>
            <meta
              name="viewport"
              content="width=device-width, initial-scale=1.0"
            />
          </Head>
          <main className="flex flex-wrap justify-center h-screen bg-gray-900 gap-8">
            <div>
              {/* <HashChainManager /> */}
            </div>
            <div className="max-w-96">
              <VideoPlayer />
            </div>
            <div>
              <PaywordManager />
            </div>
          </main>
        </div>
      </HashChainProvider>
    </HashChainExtensionProvider>
  );
};

export default Home;
