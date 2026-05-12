import { cn } from '@/src/lib/utils';

interface Cuisine {
  name: string;
  emoji: string;
  from: string;
  to: string;
}

const CUISINES: Cuisine[] = [
  { name: "Итальянская", emoji: "🍝", from: "#fff3e0", to: "#ffe0b2" },
  { name: "Азиатская", emoji: "🍜", from: "#e8f5e9", to: "#c8e6c9" },
  { name: "Французская", emoji: "🥐", from: "#fce4ec", to: "#f8bbd0" },
  { name: "Мексиканская", emoji: "🌮", from: "#fff8e1", to: "#ffecb3" },
  { name: "Японская", emoji: "🍱", from: "#e3f2fd", to: "#bbdefb" },
  { name: "Греческая", emoji: "🥗", from: "#f3e5f5", to: "#e1bee7" },
  { name: "Американская", emoji: "🍔", from: "#fbe9e7", to: "#ffccbc" },
  { name: "Индийская", emoji: "🍛", from: "#fffde7", to: "#fff9c4" },
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
            className="group relative h-24 w-44 shrink-0 mx-3 flex flex-col items-center justify-center gap-2 rounded-3xl bg-white border border-orange-100/60 shadow-sm hover:border-orange-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-4 transition-all overflow-hidden cursor-pointer"
            id={`cuisine-card-${idx}`}
          >
            {/* Gradient Background on Hover & Focus */}
            <div 
              className="absolute inset-0 opacity-0 scale-150 group-hover:opacity-100 group-hover:scale-100 group-focus:opacity-100 group-focus:scale-100 transition-all duration-500 ease-out z-0"
              style={{ background: `linear-gradient(135deg, ${cuisine.from}, ${cuisine.to})` }}
            />
            
            <span className="text-3xl relative z-10" id={`cuisine-emoji-${idx}`}>{cuisine.emoji}</span>
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
