import Image from "next/image"
  import logo from "@/../public/Home/gato_naranja.png"
import { Button } from "../ui/button";
import Title from "../utils/title";

function Header() {
  return(
    <header className="h-20 flex w-screen sticky top-0 justify-between p-5 drop-shadow-md border-b border-inherit">
     <figure className="relative aspect-square h-full">
      <Image 
        src={logo} 
        alt={"logo"}
        fill
        />
     </figure>
      
      <Button>
        <Title moreClasses="text-xl">Play now!</Title>
      </Button>
    </header>

  )
}

export default Header;