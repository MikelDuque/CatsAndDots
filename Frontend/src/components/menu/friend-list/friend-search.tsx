import { Search } from "lucide-react";
import { Input } from "../../ui/input";
import { User } from "@/lib/types";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
import {useFriendList} from "@/features/user-list/useFriendList";

type friendSearchProps = {
  setDisplayFriendList: (friends: User[]) => void
}

export default function FriendSearch({setDisplayFriendList}: friendSearchProps) {
  const { friendList } = useFriendList();

  const [inputValue, setInputValue] = useState<string>("");
  const [debouncedValue] = useDebounce(inputValue, 100);

  useEffect(() => {
    filterFriendList();

  }, [friendList, debouncedValue]);

  function filterFriendList() {
    let filteredList = friendList;

    if (debouncedValue) {
      filteredList = friendList.filter(friend => friend.username.toLowerCase().includes(debouncedValue.toLowerCase()));
    }

    setDisplayFriendList([...filteredList]);
  };

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    setInputValue(e.target.value);
  };

  return (
    <form className="flex items-center w-full gap-2">
      <Search/>
      <Input
        name="friendname"
        type="text"
        placeholder="Buscar amigo"
        value={inputValue}
        onChange={handleInputChange}
      />
    </form>
  );
};