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
          <main className="w-full h-screen bg-gray-900 ">
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
            <div className="flex flex-row gap-10 p-10">
              <div className="w-full">
                <VideoPlayer />
              </div>
              <div className="w-full">
                <HashchainManager />
              </div>
            </div>
          </main>
        </div>
      </HashChainProvider>
    </HashChainExtensionProvider>
  );
};

export default Home;
