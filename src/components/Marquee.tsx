interface Cuisine {
  name: string;
  emoji: string;
  imageUrl: string;
  from: string;
  to: string;
}

// Square crops from Unsplash, ~240px @ 75% — small enough to load fast in a
// horizontally-scrolling marquee but sharp on retina at the 64px badge size.
const UNSPLASH = 'auto=format&fit=crop&w=240&h=240&q=75';

const CUISINES: Cuisine[] = [
  { name: "Итальянская", emoji: "🍝", imageUrl: `https://images.unsplash.com/photo-1551183053-bf91a1d81141?${UNSPLASH}`, from: "#fff3e0", to: "#ffe0b2" },
  { name: "Азиатская", emoji: "🍜", imageUrl: `https://images.unsplash.com/photo-1569718212165-3a8278d5f624?${UNSPLASH}`, from: "#e8f5e9", to: "#c8e6c9" },
  { name: "Французская", emoji: "🥐", imageUrl: `https://images.unsplash.com/photo-1555507036-ab1f4038808a?${UNSPLASH}`, from: "#fce4ec", to: "#f8bbd0" },
  { name: "Мексиканская", emoji: "🌮", imageUrl: `https://images.unsplash.com/photo-1565299585323-38d6b0865b47?${UNSPLASH}`, from: "#fff8e1", to: "#ffecb3" },
  { name: "Японская", emoji: "🍱", imageUrl: `https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?${UNSPLASH}`, from: "#e3f2fd", to: "#bbdefb" },
  { name: "Греческая", emoji: "🥗", imageUrl: `https://images.unsplash.com/photo-1540420773420-3366772f4999?${UNSPLASH}`, from: "#f3e5f5", to: "#e1bee7" },
  { name: "Американская", emoji: "🍔", imageUrl: `https://images.unsplash.com/photo-1568901346375-23c9450c58cd?${UNSPLASH}`, from: "#fbe9e7", to: "#ffccbc" },
  { name: "Индийская", emoji: "🍛", imageUrl: `https://images.unsplash.com/photo-1565557623262-b51c2513a641?${UNSPLASH}`, from: "#fffde7", to: "#fff9c4" },
];

interface MarqueeProps {
  onSelectCuisine: (cuisine: Cuisine) => void;
}

export default function Marquee({ onSelectCuisine }: MarqueeProps) {
  return (
    <section className="relative w-full overflow-hidden mt-10 md:mt-16 pb-24" id="marquee-section">
      {/* Edge Masks */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#fdf8f5] to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#fdf8f5] to-transparent z-10 pointer-events-none" />

      <div className="flex w-fit animate-marquee hover:[animation-play-state:paused]" id="marquee-container">
        {[...CUISINES, ...CUISINES].map((cuisine, idx) => (
          <button
            key={`${cuisine.name}-${idx}`}
            onClick={() => onSelectCuisine(cuisine)}
            className="group relative h-28 w-48 shrink-0 mx-3 flex flex-col items-center justify-center gap-2 rounded-3xl bg-white border border-orange-100/60 shadow-sm hover:border-orange-300 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-4 transition-all overflow-hidden cursor-pointer"
            id={`cuisine-card-${idx}`}
          >
            {/* Gradient Background on Hover & Focus */}
            <div
              className="absolute inset-0 opacity-0 scale-150 group-hover:opacity-100 group-hover:scale-100 group-focus:opacity-100 group-focus:scale-100 transition-all duration-500 ease-out z-0"
              style={{ background: `linear-gradient(135deg, ${cuisine.from}, ${cuisine.to})` }}
            />

            <div
              className="relative z-10 w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow-md ring-1 ring-orange-100 group-hover:scale-105 transition-transform duration-300"
              id={`cuisine-photo-${idx}`}
            >
              <img
                src={cuisine.imageUrl}
                alt={cuisine.name}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-[12px] font-semibold text-[#78716c] group-hover:text-[#1a0a00] group-focus:text-[#1a0a00] relative z-10 transition-colors" id={`cuisine-name-${idx}`}>
              {cuisine.name}
            </span>
          </button>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 30s linear infinite;
        }
      `}} />
    </section>
  );
}
