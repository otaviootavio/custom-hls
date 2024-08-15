import React from "react";
import { NextPage } from "next";
import Head from "next/head";
import { HashChainProvider } from "@/context/HashChainContext";
import VideoPlayer from "@/components/VideoPlayer";
import HashchainManager from "@/components/HashchainManager";
import { HashChainExtensionProvider } from "@/context/HashChainExtensionProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
            <ToastContainer
              position="bottom-left"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="colored"
            />
            <div className="max-w-96">
              <VideoPlayer />
            </div>
            <div>
              <HashchainManager />
            </div>
          </main>
        </div>
      </HashChainProvider>
    </HashChainExtensionProvider>
  );
};

export default Home;
