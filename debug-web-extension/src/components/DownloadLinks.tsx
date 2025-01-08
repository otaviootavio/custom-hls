import { Button } from "@/components/ui/button";

export const DownloadLinks = () => {
  return (
    <div className="flex gap-4">
      <Button asChild size="sm">
        <a
          href="https://utfs.io/f/I7zWwfduN6HqBXY1Yxpz1t5W2dlIaYMpkXJ8cRiSnrZHVP67"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download for Chrome
        </a>
      </Button>
      <Button asChild size="sm">
        <a
          href="https://utfs.io/f/I7zWwfduN6HqBXY1Yxpz1t5W2dlIaYMpkXJ8cRiSnrZHVP67"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download for Firefox
        </a>
      </Button>
      <Button asChild size="sm">
        <p
          onClick={async () => {
            const data = await fetch(
              "https://jsonplaceholder.typicode.com/todos/1"
            );
            console.log(await data.json());
          }}
        >
          Download for Edge
        </p>
      </Button>
    </div>
  );
};

export default DownloadLinks;
