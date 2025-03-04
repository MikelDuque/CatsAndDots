"use client"
import { BASE_HTTPS_URL } from "@/features/endpoints/endpoints";
import Title from "../utils/title";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useAuth } from "@/features/auth/auth-context";
import { adminPath } from "@/lib/paths";
import { useRouter } from "next/navigation";



export default function ProfileInfo() {
  const router = useRouter();
  const {decodedToken, logOut} = useAuth();
  const avatarUrl = `${BASE_HTTPS_URL}${decodedToken?.avatar}`;


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
        <DropdownMenuItem disabled={decodedToken?.role == null} onSelect={() => router.push(adminPath)} className="cursor-default rounded-sm px-2 py-1.5 outline-none focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
          Administración
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={logOut} className="cursor-pointer rounded-sm px-2 py-1.5 focus:bg-accent focus:text-accent-foreground">
          Cerrar Sesión
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};