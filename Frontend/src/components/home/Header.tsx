import Image from "next/image"

function Header() {
  return(
    <div>
      <Image 
      className=""
      src={"/logo.png"} 
      alt={"logo"}
      height={70}
      width={70}
      />      
    </div>
  )
}

export default Header;