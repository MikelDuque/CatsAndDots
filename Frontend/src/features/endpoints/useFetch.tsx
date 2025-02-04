import fetchEndpoint from "@/features/endpoints/fetch-endpoint";
import { FetchProps } from "@/lib/types";
import { useEffect, useState } from "react";
import { LogOut } from "../auth/actions/server-actions";
import { boolean } from "zod";

export default function useFetch({url, type, token, params, needAuth, condition}: FetchProps) {
  const [fetchData, setFetchData] = useState<any>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<Record<string, unknown> | unknown>(null);

  useEffect(() => {
    if(typeof condition === "boolean" && !condition) return; //Si la condicion es booleana (NO null o undefined), y esta es FALSA, retorna.

    fetchingData();

  }, [url, type, params, token, condition])

  async function fetchingData() {
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
    fetchError
  });
};