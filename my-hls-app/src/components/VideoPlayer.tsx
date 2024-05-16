import useHls from "@/hooks/useHls";

interface VideoPlayerProps {
  password: number;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ password }) => {
  const videoRef = useHls("http://localhost:3000/api/playlist", password);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-900">
      <video
        ref={videoRef}
        controls
        className="w-full max-w-2xl border-4 border-gray-700"
      ></video>
    </div>
  );
};

export default VideoPlayer;
