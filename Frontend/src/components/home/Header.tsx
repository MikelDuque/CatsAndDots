import Image from "next/image"
import { Button } from "../ui/button";
import Title from "../utils/title";

function Header() {
  return(
    <header className="flex w-screen sticky top-0 justify-between px-10 py-5 drop-shadow-md border-b border-inherit">
      <Image 
      src={"/gato_naranja.png"} 
      alt={"logo"}
      height={50}
      width={50}
      />
      <Button>
        <Title moreClasses="text-xl">Play now!</Title>
      </Button>
    </header>

  )
}

export default Header;