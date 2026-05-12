import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { useState, useEffect } from 'react';
import ProfileButton from './ProfileButton';
import FridgeButton from './FridgeButton';

const TOP_DISHES = [
  {
    id: 'pasta',
    title: "Паста карбонара",
    emoji: "🍝",
    author: "Мария И.",
    likes: "243",
    time: "25 мин",
    gradient: "from-orange-100 to-amber-50"
  },
  {
    id: 'salad',
    title: "Греческий салат",
    emoji: "🥗",
    author: "Александр Д.",
    likes: "187",
    time: "15 мин",
    gradient: "from-green-50 to-emerald-100"
  },
  {
    id: 'pizza',
    title: "Пепперони",
    emoji: "🍕",
    author: "Луиджи В.",
    likes: "512",
    time: "20 мин",
    gradient: "from-red-50 to-orange-100"
  }
];

interface HeroProps {
  onSelectRecipe?: (recipe: any) => void;
  onExplore?: () => void;
  onAIClick?: () => void;
}

export default function Hero({ onSelectRecipe, onExplore, onAIClick, onNavigateProfile, onLogout }: HeroProps & { onNavigateProfile?: (tab: any) => void; onLogout?: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % TOP_DISHES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentDish = TOP_DISHES[currentIndex];
  const nextDish = TOP_DISHES[(currentIndex + 1) % TOP_DISHES.length];
  const thirdDish = TOP_DISHES[(currentIndex + 2) % TOP_DISHES.length];

  return (
    <section className="px-4 pt-10 pb-4" id="hero-section">
      <div className="relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-white border border-orange-100/50 shadow-[0_40px_100px_-20px_rgba(216,90,48,0.06)] overflow-hidden min-h-[500px] md:h-[600px] flex flex-col" id="hero-container">
        
        {/* Profile and Fridge Buttons Top Right */}
        <div className="absolute top-8 right-8 z-50 flex flex-col items-center gap-6">
          <ProfileButton 
            onNavigate={(tab) => onNavigateProfile?.(tab)} 
            onLogout={() => onLogout?.()} 
          />
          <FridgeButton onClick={() => onAIClick?.()} />
        </div>

        {/* Background Layer */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none" id="hero-bg">
          <div className="absolute top-[-100px] right-[-100px] w-[500px] h-[500px] rounded-full bg-orange-100/40 blur-3xl" id="bg-circle-1" />
          <div className="absolute bottom-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full bg-amber-50/60 blur-3xl" id="bg-circle-2" />
          
          {/* Scattered Emojis */}
          <span className="absolute top-[10%] left-[55%] text-6xl opacity-[0.04] rotate-12">🍝</span>
          <span className="absolute top-[40%] left-[45%] text-5xl opacity-[0.04] -rotate-12">🥘</span>
          <span className="absolute top-[70%] left-[60%] text-7xl opacity-[0.04] rotate-45">🍜</span>
          <span className="absolute top-[15%] left-[85%] text-5xl opacity-[0.04] -rotate-45">🥗</span>
          <span className="absolute top-[60%] left-[10%] text-6xl opacity-[0.04] rotate-12">🍕</span>
          <span className="absolute top-[20%] left-[5%] text-5xl opacity-[0.04] -rotate-12">🧁</span>
        </div>

        {/* Text Content */}
        <div className="relative z-20 flex-1 px-8 md:px-16 pt-12 md:pt-16 flex flex-col items-start pb-12 md:pb-0" id="hero-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="flex flex-col items-start"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center bg-orange-50 border border-orange-200 rounded-full px-4 py-1 mb-6" id="hero-eyebrow">
              <span className="text-[#D85A30] text-[13px] font-semibold">🍳 Кулинарное сообщество</span>
            </div>

            {/* Headline */}
            <h1 className="font-display text-[44px] md:text-[58px] font-medium tracking-tight text-[#1a0a00] leading-[1.1] mb-6" id="hero-headline">
              Готовь. Делись.<br />
              <span className="text-[#D85A30]">Вдохновляй</span> других.
            </h1>

            {/* Subheadline */}
            <p className="font-sans text-[15px] md:text-[16px] text-[#78716c] max-w-[480px] leading-relaxed mb-10" id="hero-subheadline">
              Публикуй рецепты, находи вдохновение и общайся с тысячами кулинаров. Бесплатно для всех.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3" id="hero-buttons">
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="bg-[#D85A30] text-white rounded-full px-8 py-3.5 font-semibold text-[14px] shadow-lg shadow-orange-700/10 cursor-pointer"
                id="btn-download"
              >
                Скачать приложение
              </motion.button>
              <button 
                onClick={onExplore}
                className="bg-white border border-orange-200 text-[#D85A30] rounded-full px-8 py-3.5 font-semibold text-[14px] hover:border-orange-400 transition-colors cursor-pointer"
                id="btn-recipes"
              >
                Смотреть рецепты
              </button>
            </div>

            {/* Stats */}
            <div className="flex gap-8 mt-12 md:mt-16" id="hero-stats">
              <div id="stat-1">
                <div className="text-[22px] font-display font-bold text-[#1a0a00]">10 000+</div>
                <div className="text-[12px] text-[#78716c]">рецептов</div>
              </div>
              <div id="stat-2">
                <div className="text-[22px] font-display font-bold text-[#1a0a00]">50 000+</div>
                <div className="text-[12px] text-[#78716c]">пользователей</div>
              </div>
              <div id="stat-3">
                <div className="text-[22px] font-display font-bold text-[#1a0a00]">4.9 ★</div>
                <div className="text-[12px] text-[#78716c]">рейтинг</div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating Cards (Desktop only) */}
        <div className="hidden lg:block absolute right-40 top-1/2 -translate-y-1/2 z-20" id="floating-cards-container">
          <div className="relative group cursor-pointer" onClick={() => onSelectRecipe?.(currentDish)}>
            <AnimatePresence mode="popLayout">
              {/* Primary Card */}
              <motion.div
                key={currentDish.id}
                initial={{ opacity: 0, x: 60, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -60, scale: 0.9 }}
                transition={{ duration: 0.6, ease: "anticipate" }}
                className="w-64 bg-white rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.08)] border border-orange-100/60 overflow-hidden relative z-20 hover:shadow-[0_30px_70px_rgba(216,90,48,0.15)] transition-shadow duration-500"
                id="card-active"
              >
                <div className={cn("h-36 bg-gradient-to-br flex items-center justify-center text-6xl", currentDish.gradient)}>
                  {currentDish.emoji}
                </div>
                <div className="p-5">
                  <div className="inline-block px-2 py-0.5 bg-orange-100 rounded text-[9px] font-bold text-orange-600 mb-2 uppercase tracking-wider">Топ дня</div>
                  <h3 className="font-display font-medium text-[16px] text-[#1a0a00] mb-2">{currentDish.title}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-5 h-5 rounded-full bg-orange-50 flex items-center justify-center text-[9px] text-orange-500 font-bold border border-orange-100">
                      {currentDish.author[0]}
                    </div>
                    <span className="text-[11px] text-[#78716c]">by {currentDish.author}</span>
                  </div>
                  <div className="flex gap-4">
                    <span className="text-[11px] text-[#78716c] flex items-center gap-1">❤️ {currentDish.likes}</span>
                    <span className="text-[11px] text-[#78716c] flex items-center gap-1">⏱ {currentDish.time}</span>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Second Card (Next) */}
            <motion.div 
              key={`next-${nextDish.id}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 0.8, x: 0 }}
              className="absolute -bottom-10 -left-10 w-56 bg-white rounded-[28px] shadow-[0_10px_30px_rgba(0,0,0,0.04)] border border-orange-100/60 overflow-hidden rotate-2 z-10 translate-x-4 translate-y-4 group-hover:translate-x-2 transition-transform duration-500" 
              id="card-next"
            >
              <div className={cn("h-28 bg-gradient-to-br flex items-center justify-center text-4xl", nextDish.gradient)}>
                {nextDish.emoji}
              </div>
              <div className="p-4 bg-white/50 backdrop-blur-sm">
                <h3 className="font-display font-medium text-[12px] text-[#78716c] truncate">{nextDish.title}</h3>
              </div>
            </motion.div>

            {/* Third Card (Future) */}
            <motion.div 
              key={`third-${thirdDish.id}`}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 0.4, x: 0 }}
              className="absolute -bottom-20 -left-16 w-48 bg-white rounded-[24px] shadow-sm border border-orange-100/60 overflow-hidden -rotate-2 z-0 translate-x-8 translate-y-8 group-hover:translate-x-4 transition-transform duration-700" 
              id="card-third"
            >
              <div className={cn("h-24 bg-gradient-to-br flex items-center justify-center text-3xl", thirdDish.gradient)}>
                {thirdDish.emoji}
              </div>
              <div className="p-3 bg-white/30 backdrop-blur-sm">
                <h3 className="font-display font-medium text-[10px] text-[#9ca3af] truncate">{thirdDish.title}</h3>
              </div>
            </motion.div>
          </div>
        </div>

      </div>
    </section>

  );
}

