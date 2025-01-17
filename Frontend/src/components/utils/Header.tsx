import Image from "next/image"
  import logo from "@/../public/Home/gato_naranja.png"
import { Button } from "../ui/button";
import Title from "./title";

function Header() {
  return(
    <header className="h-14 fixed flex items-center w-screen top-0 justify-between py-1 px-3 shadow-md bg-background">
     <figure className="relative aspect-square h-4/5">
      <Image 
        src={logo} 
        alt={"logo"}
        fill
        />
     </figure>
      
      <Button>
        <Title moreClasses="text-sm">Play now!</Title>
      </Button>
    </header>

  )
}

export default Header;