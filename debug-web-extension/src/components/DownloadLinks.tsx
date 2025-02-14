import { Button } from "@/components/ui/button";

export const DownloadLinks = () => {
  return (
    <div className="flex gap-4">
      <Button asChild size="sm">
        <a
          href="https://do27d9uxrn.ufs.sh/f/g7YqjDR3JjGdpuqGcAztUXHgnMfGEsaAFL4r2ObVQujPw5eq"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download for Chrome
        </a>
      </Button>
      <Button asChild size="sm">
        <a
          href="https://do27d9uxrn.ufs.sh/f/g7YqjDR3JjGdGtlMjLO8cvpM9VrNC62atdqRI5UP3oxyJmkj"
          target="_blank"
          rel="noopener noreferrer"
        >
          Download for Firefox
        </a>
      </Button>
    </div>
  );
};

export default DownloadLinks;
