import { NextPage } from "next";
import Head from "next/head";
import VideoPlayer from "../components/VideoPlayer";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Custom HLS</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>
      <main>
        <VideoPlayer />
      </main>
    </div>
  );
};

export default Home;
