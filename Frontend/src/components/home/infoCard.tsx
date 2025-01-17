import Image from "next/image";

interface InfoCardProps {
  infoTitle: string;
  path: string;
  text: string;

}

function InfoCard({infoTitle,path,text}:InfoCardProps ) {
  return (
    <section className="w-[200px] flex flex-col items-center h-3/4 justify-between">
      <h1>{infoTitle}</h1>
      <Image
        src={path}
        alt={"info image"}
        height={400}
        width={400}
        className="border-4 border-gray-500 rounded-lg"
      />
      <p>{text}</p>
    </section>
  )
}

export default InfoCard;