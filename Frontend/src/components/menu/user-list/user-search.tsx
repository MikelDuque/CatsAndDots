"use client"

import { Search } from "lucide-react";
import { Input } from "../../ui/input";
import { User } from "@/lib/types";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import useFetch from "@/features/endpoints/useFetch";
import { POST_FILTERED_USERS } from "@/features/endpoints/endpoints";
import { useAuth } from "@/features/auth/auth-context";

type userSearchProps = {
  setDisplayUserList: (users: User[]) => void
}

export default function UserSearch({setDisplayUserList}: userSearchProps) {
  const { token } = useAuth();

  const [inputValue, setInputValue] = useState<string>("");
  const [debouncedValue] = useDebounce(inputValue, 100);

  const { fetchData } = useFetch({url: POST_FILTERED_USERS, type: 'POST', params:debouncedValue, token: token, needAuth: true, condition: !!token});

  useEffect(() => {
    if (fetchData) setDisplayUserList(fetchData as User[]);

  }, [fetchData]);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setInputValue(e.target.value);
  };

  return (
    <form className="flex w-full gap-1">
      <Input
        name="username"
        type="text"
        placeholder="Buscar amigo"
        value={inputValue}
        onChange={handleInputChange}
      />
      <Search/>
    </form>
  );
};