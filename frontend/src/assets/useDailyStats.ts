import { useEffect, useState } from "react";
import { fetchDailyStats } from "../api";
import type { ApiResponse, QueryParams } from "../types";

//Custom hook to fetch daily statistics based on query parameters
//Made with copilot suggestion and minor modifications
export function useDailyStats(params: QueryParams) {
  const [resp, setResp] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError("");

      try {
        const data = await fetchDailyStats(params, {
          signal: controller.signal,
        });
        setResp(data);
      } catch (e: unknown) {
        if (e instanceof DOMException && e.name === "AbortError") return;
        setError(e instanceof Error ? e.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [params]);

  return { resp, loading, error };
}
