"use client";

import { useAuth } from "@/features/auth/auth-context";
import { UserData } from "@/lib/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BASE_HTTPS_URL } from "@/features/endpoints/endpoints";
import { Button } from "../ui/button";

type UserElementProps = {
  user: UserData;
  changeRol: (role: string) => void;
  deleteUser: () => void;
};

export default function UserElement({ user, changeRol, deleteUser }: UserElementProps) {
  const { decodedToken } = useAuth();
  const role = user.role ?? "usuario";
  const avatarUrl = user.avatar ? `${BASE_HTTPS_URL}${user.avatar}` : "/default-avatar.png";

  return (
    <div className="flex items-center justify-between bg-card shadow-lg rounded-2xl p-4 border border-border">
    
      <div className="flex items-center gap-4">
        <Avatar className="w-14 h-14 border border-border">
          <AvatarImage src={avatarUrl} alt={`Avatar de ${user.username}`} />
          <AvatarFallback className="bg-muted text-muted-foreground">
            {user.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div>
          <h2 className="text-lg font-semibold text-card-foreground">{user.username}</h2>
          <p className="text-sm text-muted-foreground">{user.mail}</p>
          <p className="text-sm font-medium text-primary">Rol: {role}</p>
        </div>
      </div>


      <form className="flex items-center gap-3">
        <select
          id={String(user.id)}
          name="role"
          defaultValue={role}
          onChange={(e) => changeRol(e.target.value)}
          disabled={decodedToken?.id === user.id}
          className="px-3 py-1 border rounded-md text-sm bg-card text-foreground border-border cursor-pointer disabled:opacity-50"
        >
          <option value="usuario">Usuario</option>
          <option value="admin">Admin</option>
        </select>

        <Button variant="destructive"
          onClick={deleteUser}
        >
          Eliminar
        </Button>
      </form>
    </div>
  );
}
