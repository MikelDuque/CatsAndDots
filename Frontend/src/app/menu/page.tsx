import { getAuth } from "@/features/auth/queries/get-auth";

export default async function Menu() {
  const { decodedToken } = await getAuth();
  const username = decodedToken?.unique_name

  return (
    <>
    <main>
      Hola {username}
    </main>
    </>
  );
}