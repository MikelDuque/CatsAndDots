import fetchEndpoint from "@/features/endpoints/fetch-endpoint";
import { FetchProps } from "@/lib/types";
import { useCallback, useState } from "react";
import { useAuth } from "../auth/auth-context";

export default function useFetchEvent() {
  const {logOut} = useAuth();

  const [fetchData, setFetchData] = useState<Promise<unknown> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<Record<string, unknown> | unknown>(null);

  const fetchingData = useCallback(async({url, type, token, params, needAuth}: FetchProps) => {
    try {
      setIsLoading(true);

      const data = await fetchEndpoint({url, type, token, params, needAuth});    
      setFetchData(data);
      setFetchError(null);

      return data;

    } catch (error) {
      if(error === "Unauthorized") logOut();
      setFetchError(error);

    } finally {
      setIsLoading(false);
    }
  }, [logOut]);

  return ({
    fetchData,
    isLoading,
    fetchError,
    fetchingData
  });
};