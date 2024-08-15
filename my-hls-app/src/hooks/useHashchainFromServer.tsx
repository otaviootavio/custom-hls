import { useState, useCallback } from "react";
import axios from "axios";

interface Hashchain {
  lastHash: string;
  chainSize: number;
  mostRecentHashIndex: number;
  mostRecentHash: string;
}

const useHaschchainFromServer = () => {
  const [hashchainFromServer, setHashchainFromServer] =
    useState<Hashchain | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchHashchainFromServer = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/get-payword");
      setHashchainFromServer(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch payword");
    } finally {
      setLoading(false);
    }
  }, []);

  const sendTailToServer = useCallback(
    async (hash: string, hashchainSize: number) => {
      setLoading(true);
      try {
        await axios.post("/api/update-payword", { hash, hashchainSize });
        await fetchHashchainFromServer();
        setError(null);
      } catch (err) {
        setError("Failed to update payword");
      } finally {
        setLoading(false);
      }
    },
    [fetchHashchainFromServer]
  );

  return {
    hashchainFromServer,
    error,
    loading,
    fetchHashchainFromServer,
    sendTailToServer,
  };
};

export default useHaschchainFromServer;
