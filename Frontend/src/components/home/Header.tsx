import Image from "next/image"
import { Button } from "../ui/button";
function Header() {
  return(
    <header className="flex justify-between w-4/5  fixed top-0  ">
      <Image 
      src={"/logo.png"} 
      alt={"logo"}
      height={70}
      width={70}
      />
      <Button>Play</Button>
    </header>

  )
}

export default Header;