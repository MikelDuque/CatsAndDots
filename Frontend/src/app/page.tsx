import Section02 from "@/components/home/section02";
import Section01 from "@/components/home/section01";
import Section03 from "@/components/home/section03";
import ThemeSwitcher from "@/features/theme/components/theme-switcher";
import Header from "@/components/home/home-header";

export default function Home() {
  return (
    <>
    <Header/>
    <main className="h-screen snap-y snap-mandatory overflow-y-scroll no-scrollbar duration-500">
      <Section01/>
      <Section02/>
      <Section03/>
      <ThemeSwitcher/>
    </main>
    </>
  );
}