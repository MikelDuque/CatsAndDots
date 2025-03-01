"use client"
import { useEffect, useState } from "react";
//UTILS
import { DecodedToken } from "@/lib/types";
import { getAuth } from "@/features/auth/queries/get-auth";
import { BASE_HTTPS_URL } from "@/features/endpoints/endpoints";
import { LogOut } from "@/features/auth/actions/server-actions";
//COMPONENTS
import Title from "../utils/title";
//SHADCN
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";


export default function ProfileInfo() {
  const [decodedToken, setDecodedToken] = useState<DecodedToken>(null);
  const avatarUrl = `${BASE_HTTPS_URL}${decodedToken?.avatar}`;
  
  async function HandleLogOut() {
    console.log("entra en handle");
    
    await LogOut();
  }

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
        <Avatar>
          <AvatarImage src={avatarUrl} alt="X" className="cursor-pointer"/>
          <AvatarFallback delayMs={600} className="title">{decodedToken?.unique_name.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={5} className="text-body">
        <DropdownMenuLabel>
          <Title moreClasses="text-lg">
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
        <DropdownMenuItem onSelect={HandleLogOut} className="cursor-pointer rounded-sm px-2 py-1.5 focus:bg-accent focus:text-accent-foreground">
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};