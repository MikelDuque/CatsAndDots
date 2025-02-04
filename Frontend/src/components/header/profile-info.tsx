import { getAuth } from "@/features/auth/queries/get-auth";
import { BASE_HTTPS_URL } from "@/features/endpoints/endpoints";
import { DecodedToken } from "@/lib/types";
import { useEffect, useState } from "react";
import { LogOut } from "@/features/auth/actions/server-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import Title from "../utils/title";

export default function ProfileInfo() {
  const [decodedToken, setDecodedToken] = useState<DecodedToken>(null);
  const avatarUrl = `${BASE_HTTPS_URL}${decodedToken?.avatar}`;

  useEffect(() => {
    async function GetDecodedToken() {
      const { decodedToken } = await getAuth();
      setDecodedToken(decodedToken);
    }

    GetDecodedToken();
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="h-full aspect-square items-center justify-center overflow-hidden rounded-full cursor-pointer">
          <AvatarImage src={avatarUrl} alt="X" className="size-full object-scale-down"/>
          <AvatarFallback delayMs={600} className="title">{decodedToken?.unique_name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="z-20 text-body relative right-2 overflow-hidden rounded-md bg-popover p-2 text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
        sideOffset={5}
      >
        <DropdownMenuLabel>
          <Title moreClasses="text-xl">
            {decodedToken?.unique_name}
          </Title>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="-mx-1 my-1 h-px bg-muted"/>
        <DropdownMenuItem className="cursor-pointer rounded-sm px-2 py-1.5 focus:bg-accent focus:text-accent-foreground">
          Perfil
        </DropdownMenuItem>
        <DropdownMenuItem disabled className="cursor-default rounded-sm px-2 py-1.5 outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
          Administración
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={LogOut} className="cursor-pointer rounded-sm px-2 py-1.5 focus:bg-accent focus:text-accent-foreground">
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};