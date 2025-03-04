import { getAuth } from "@/features/auth/queries/get-auth";
import { menuPath } from "@/lib/paths";
import { redirect } from "next/navigation";

export default async function MenuLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {decodedToken} = await getAuth();
  
  if (decodedToken?.role !== "admin") redirect(menuPath);
  
  return <>{children}</>
}