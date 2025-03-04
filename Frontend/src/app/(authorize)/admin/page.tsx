import HandleUser from "@/components/admin/handle-user";
import Header from "@/components/header/header";
import ThemeSwitcher from "@/components/theme/theme-switcher";

export default function Admin() {
  return (
    <>
    <Header/>
    <main className="h-[92.5%] w-full flex">
      <HandleUser/>
    </main>
    <ThemeSwitcher />
    </>
  );
}