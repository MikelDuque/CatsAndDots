import { getAuth } from "@/features/auth/queries/get-auth";
import { loginPath } from "@/lib/paths";
import { redirect } from "next/navigation";

export default async function AuthorizeLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const {token} = await getAuth();

  if (!token) redirect(loginPath)
  
  return <>{children}</>;
}