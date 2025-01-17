import Image from "next/image"
import { Button } from "../ui/button";
function Header() {
  return(
    <header className="flex justify-between items-center px-4 py-2 w-3/4  ">
      <Image 
      src={"/gato_naranja.png"} 
      alt={"logo"}
      height={50}
      width={50}
      />
      <Button>Play</Button>
    </header>

  )
}

export default Header;