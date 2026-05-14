import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

interface NavbarProps {
  onAIClick: () => void;
  onAboutClick?: () => void;
}

export default function Navbar({ onAIClick, onAboutClick }: NavbarProps) {
  return (
    <motion.nav 
      initial={{ opacity: 0, y: 20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      transition={{ delay: 0.5, duration: 0.6 }}
      className="fixed bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center bg-white/90 backdrop-blur-2xl px-1.5 py-1.5 rounded-full shadow-[0_12px_40px_rgba(216,90,48,0.10)] border border-orange-100/40"
      id="main-nav"
    >
      <div className="w-9 h-9 bg-orange-50 border border-orange-100 shadow-sm rounded-full flex items-center justify-center text-lg" id="nav-logo">
        🍳
      </div>
      
      <div className="flex items-center" id="nav-links">
        <button 
          onClick={onAIClick}
          className="text-[12px] font-semibold text-orange-600 hover:text-[#D85A30] px-4 transition-colors cursor-pointer flex items-center gap-1.5" 
          id="nav-ai"
        >
          <Sparkles className="w-3.5 h-3.5" />
          ИИ-Помощник
        </button>
        <button
          onClick={() => {
            const aboutSection = document.getElementById('about-section');
            if (aboutSection) {
              aboutSection.scrollIntoView({ behavior: 'smooth' });
              return;
            }
            onAboutClick?.();
          }}
          className="text-[12px] font-semibold text-slate-500 hover:text-[#D85A30] px-4 transition-colors cursor-pointer"
          id="nav-about"
        >
          О нас
        </button>
      </div>

      <button
        type="button"
        aria-label="Скачать мобильное приложение RecipeWorld"
        className="bg-[#D85A30] text-white px-5 py-2 rounded-full text-[12px] font-semibold shadow-sm hover:bg-[#c44e27] transition-all cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
        id="nav-download"
      >
        Скачать →
      </button>
    </motion.nav>
  );
}
