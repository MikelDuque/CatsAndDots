"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/features/auth/auth-context";
import { GET_ALL_USERS, HANDLE_USER, DELETE_USER } from "@/features/endpoints/endpoints";
import { UserData } from "@/lib/types";
import { Dialog, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import UserElement from "./user";
import Title from "../utils/title";

export default function HandleUser() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [selectedUser, setSelectedUser] = useState<number | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { token, decodedToken } = useAuth();

  useEffect(() => {
    if (token) fetchUsers();
  }, [token]);

  async function fetchUsers(): Promise<void> {
    try {
      const response = await fetch(GET_ALL_USERS, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al obtener usuarios");
      const data: UserData[] = await response.json();
      setUsers(data || []);
    } catch (error) {
      console.error(error);
    }
  }

  async function handleUpdate(userId: number, role: string): Promise<void> {
    if (decodedToken?.id === userId) {
      alert("No puedes modificar tu propio usuario");
      return;
    }

    try {
      const response = await fetch(HANDLE_USER, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, role }),
      });
      if (!response.ok) throw new Error("Error al actualizar el usuario");
      await fetchUsers();
    } catch (error) {
      console.error(error);
    }
  }

  function confirmDelete(userId: number): void {
    setSelectedUser(userId);
    setShowDeleteDialog(true);
  }

  async function handleDelete(): Promise<void> {
    if (!selectedUser) return;
    try {
      const response = await fetch(DELETE_USER(selectedUser), {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Error al eliminar el usuario");
      await fetchUsers();
    } catch (error) {
      console.error(error);
    } finally {
      setShowDeleteDialog(false);
      setSelectedUser(null);
    }
  }

  return (
    <div className="flex flex-col ustify-center item-center w-full p-4 gap-10">
      <Title >Gestión de Usuarios</Title>
      <ul className="grid grid-cols-3  gap-4">
        {users.length > 0 ? (
          users.map((user) => (
            <UserElement
              key={user.id}
              user={user}
              changeRol={(role: string) => handleUpdate(user.id, role)} 
              deleteUser={() => confirmDelete(user.id)}
            />
          ))
        ) : (
          <p>No se han podido cargar los usuarios</p>
        )}
      </ul>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>¿Eliminar usuario?</DialogHeader>
          <p>Esta acción no se puede deshacer.</p>
          <DialogFooter>
            <Button onClick={() => setShowDeleteDialog(false)}>Cancelar</Button>
            <Button onClick={handleDelete} className="bg-red-500 text-white">
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
