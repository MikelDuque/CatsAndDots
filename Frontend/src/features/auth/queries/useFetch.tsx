import fetchEndpoint from "@/features/auth/queries/fetch-endpoint";
import { FetchProps } from "@/lib/types";
import { useState } from "react";
import { LogOut } from "../actions/server-actions";

export default function useFetch() {
  const [fetchData, setFetchData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<Record<string, unknown> | unknown>(null);

  async function fetchingData({url, type, token, params, needAuth}: FetchProps) {
    try {
      setIsLoading(true);

      const data = await fetchEndpoint({url, type, token, params, needAuth});    
      setFetchData(data);
      setFetchError(null);

      return data;

    } catch (error) {
      if(error === "Unauthorized") await LogOut();
      setFetchError(error);

    } finally {
      setIsLoading(false);
    }
  };

  return ({
    fetchData,
    isLoading,
    fetchError,
    fetchingData
  });
};