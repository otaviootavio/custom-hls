import { useState, useCallback } from "react";
import axios from "axios";

export interface Hashchain {
  lastHash: string;
  chainSize: number;
  mostRecentHashIndex: number;
  mostRecentHash: string;
  chainId: number;
  smartContractAddress: string;
  amount: string;
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
    async (
      hash: string,
      hashchainSize: number,
      chainId: number,
      smartContractAddress: string,
      toAddress: string,
      amount: string
    ) => {
      setLoading(true);
      try {
        await axios
          .post("/api/update-payword", {
            hash,
            hashchainSize,
            chainId,
            smartContractAddress,
            toAddress,
            amount,
          })
          .catch((err) => {
            console.error("Error updating payword:", err);
            setError("Failed to update payword");
            setLoading(false);
            throw err;
          })
          .finally(() => {
            setLoading(false);
            setError(null);
          });
      } catch (err) {
        setError("Failed to update payword");
        throw err;
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
