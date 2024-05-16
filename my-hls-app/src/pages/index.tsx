import { useState } from "react";
import { NextPage } from "next";
import Head from "next/head";
import VideoPlayer from "../components/VideoPlayer";

const Home: NextPage = () => {
  const [secretWord, setSecretWord] = useState("secretWord");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSecretWord(event.target.value);
  };

  return (
    <div>
      <Head>
        <title>Custom HLS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main className="flex flex-col items-center justify-center h-screen bg-gray-900">
        <form className="mb-4">
          <label
            className="block text-gray-300 text-sm font-bold mb-2"
            htmlFor="secretWord"
          >
            Secret Word:
          </label>
          <input
            type="text"
            id="secretWord"
            value={secretWord}
            onChange={handleInputChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </form>
        <VideoPlayer secretWord={secretWord} />
      </main>
    </div>
  );
};

export default Home;
