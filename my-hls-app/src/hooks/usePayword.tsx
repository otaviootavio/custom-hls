import { useState, useCallback } from "react";
import axios from "axios";

interface Payword {
  lastHash: string;
  chainSize: number;
  mostRecentHashIndex: number;
  mostRecentHash: string;
}

const usePayword = () => {
  const [payword, setPayword] = useState<Payword | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchPayword = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/get-payword");
      setPayword(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch payword");
    } finally {
      setLoading(false);
    }
  }, []);

  const updatePayword = useCallback(
    async (hash: string, position: number) => {
      setLoading(true);
      try {
        await axios.post("/api/update-payword", { hash, position });
        await fetchPayword();
        setError(null);
      } catch (err) {
        setError("Failed to update payword");
      } finally {
        setLoading(false);
      }
    },
    [fetchPayword]
  );

  return { payword, error, loading, fetchPayword, updatePayword };
};

export default usePayword;
