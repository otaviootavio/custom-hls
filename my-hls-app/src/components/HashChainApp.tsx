import React, { useState } from "react";
import HashChainManager from "./HashChainManager";
import VideoPlayer from "./VideoPlayer";

const HashchainApp = () => {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <HashChainManager />
      </div>
      <div className="max-w-96">
        <VideoPlayer />
      </div>
    </div>
  );
};

export default HashchainApp;
