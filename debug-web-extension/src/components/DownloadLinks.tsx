import { Button } from "@/components/ui/button";

export const DownloadLinks = () => {
  return (
    <div className="flex gap-4">
      <Button asChild size="sm">
        <a
          href="https://utfs.io/f/I7zWwfduN6Hq378xB6NDtGduPji54QEgWxl1FMXVZUYBsb87"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download for Chrome
        </a>
      </Button>
      <Button asChild size="sm">
        <a
          href="https://utfs.io/f/I7zWwfduN6HqPtcxLuF17DkNBMzcVJOnePdtlYaq2iCyFSWp"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download for Firefox
        </a>
      </Button>
      <Button asChild size="sm" variant={"outline"}>
        <p
          onClick={async () => {
            const data = await fetch(
              "https://jsonplaceholder.typicode.com/todos/1"
            );
            console.log(await data.json());
          }}
        >
          Dummy fetch
        </p>
      </Button>
    </div>
  );
};

export default DownloadLinks;
