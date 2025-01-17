import Section02 from "@/components/home/section02/Section02";
import Section01 from "@/components/home/section01/section01";
import Section03 from "@/components/home/section03/section03";
import ThemeSwitcher from "@/components/theme/theme-switcher";

export default function Home() {
  return (
    <>
    <Section01/>
    <Section02/>
    <Section03/>
    <ThemeSwitcher/>
    </>
  );
}
