"use client"

import { getAuth } from "@/features/auth/queries/get-auth";
import { useRouter } from "next/navigation";

export default async function MenuLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter()
  const {decodedToken} = await getAuth();
  
  if (decodedToken?.role !== "admin") router.back;
  
  return <>{children}</>
}