import Image5 from '../assets/item-chemex.png';
import Image6 from '../assets/item-cup.png';
import Image8 from '../assets/item-ethiopia.png';
import Image10 from '../assets/item-kenya.png';
import Image11 from '../assets/item-kilo.png';
import Image13 from '../assets/item-shirt.png';
import Image15 from '../assets/store-coffee.png';
import Image17 from '../assets/store-honey.png';
import Image18 from '../assets/store-keramos.png';
import Image20 from '../assets/store-loom.png';
import Image21 from '../assets/store-oak.png';
import Image22 from '../assets/store-paper.png';

function LandingPage() {
  return (
    <div className={'flex flex-1 flex-col'}>
      <div className={'text-4xl font-bold text-[#032048] text-center'}>Swipe stores</div>
      <div className={'text-xl text-[#032048] text-center'}>
        Сайт, де магазин продає, і стрічка, де він говорить, зараз живуть окремо. Souqum збирає це
        разом: магазин знаходять, він веде канал, купують на його сайті.
      </div>
      <div className="columns-1 md:columns-6 sm:columns-2 gap-3 px-4 sm:px-20 text-center w-full bg-[#F6F0E4]">
        {[
          Image5,
          Image15,
          Image21,
          Image6,
          Image10,
          Image22,
          Image17,
          Image11,
          Image13,
          Image20,
          Image18,
          Image8,
        ].map((item) => (
          <img
            className="rounded-2xl mb-3 inline-block max-w-full break-inside-avoid"
            src={item}
            alt=""
          />
        ))}
      </div>
    </div>
  );
}

export default LandingPage;
