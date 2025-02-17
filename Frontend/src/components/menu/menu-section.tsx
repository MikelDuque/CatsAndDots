"use client"

export default function MenuSection({ onSelectCats }: { onSelectCats: () => void }) {
  return (
    <section className="w-full flex">
      <MenuCard isHuman={false}/>
      <MenuCard isHuman={true} onClick={onSelectCats}/>
    </section>
  );
};

type MenuCard = {
  isHuman: boolean,
  divClass?: string
  onClick?: () => void;
}

function MenuCard({isHuman, divClass, onClick }: MenuCard) {
  return (
    <div className={`flex grow-[1] items-center justify-center bg-bots_card cursor-pointer hover:grow-[2] transition-all ${isHuman ? "bg-cats_card" : "bg-bots_card"} ${divClass}`}  onClick={onClick}>
      <h1 className={`super-title hover:text-shadow-titleShadow ${isHuman && "relative after:content-['(Humanos)'] after:absolute after:left-1/2 after:-bottom-5 after:-translate-x-1/2 after:text-3xl"}`}>
        {isHuman ? "Cats" : "Bots"}
      </h1>
    </div>
  );
};