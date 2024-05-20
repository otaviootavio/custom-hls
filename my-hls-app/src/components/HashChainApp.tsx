import React, { useState } from "react";
import HashChainManager from "./HashChainManager";
import VideoPlayer from "./VideoPlayer";

const HashchainApp = () => {
  const [hashChain, setHashChain] = useState<string[]>([]);

  return (
    <div className="flex flex-col gap-4">
      <div>
        <HashChainManager hashChain={hashChain} setHashChain={setHashChain} />
      </div>
      <div className="max-w-96">
        <VideoPlayer hashChain={hashChain} />
      </div>
    </div>
  );
};

export default HashchainApp;
