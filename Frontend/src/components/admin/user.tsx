"use client"

import { useAuth } from "@/features/auth/auth-context";
import { UserData } from "@/lib/types";

type UserElementProps = {
  user: UserData
  changeRol: () => void
  deleteUser: () => void
}

export default function UserElement({user, changeRol, deleteUser}: UserElementProps) {
  const {decodedToken} = useAuth();
  const role = user.role != null ? user.role : "usuario";

  return(
    <div className="">
      <div className="">
        <h2>Usuario: {user.id}</h2>
        <div className="">
          <span>{user.username.length < 25 ? user.username : `${user.username.substring(0, 24)}...`}</span>
          <span>Mail: {user.mail}</span>
          <span>Rol: {role}</span>
        </div>
      </div>

      <form className="">
        <select id={String(user.id)} name='role' defaultValue={role} onChange={changeRol} disabled={decodedToken?.id == user.id}>
          <option value={undefined}>usuario</option>
          <option value="admin">admin</option>
        </select>
        <a id={String(user.id)} onClick={deleteUser}>Eliminar</a>
      </form>
      
    </div>
  )
}