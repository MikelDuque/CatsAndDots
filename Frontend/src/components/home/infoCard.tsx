import Image, { StaticImageData } from "next/image";
import Title from "../utils/title";

interface InfoCardProps {
  children: string;
  title: string;
  img: StaticImageData;
}

function InfoCard({children, title, img}:InfoCardProps ) {
  return (
    <div className="max-w-md flex flex-col items-center gap-10">
      <Title moreClasses="text-4xl">{title}</Title>
      <Image
        src={img}
        alt={"info image"}
        className="border-4 border-gray-500 rounded-lg"
      />
      <p className="text-body text-lg">{children}</p>
    </div>
  )
}

export default InfoCard;