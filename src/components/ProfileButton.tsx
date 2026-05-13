import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Settings, Bookmark, LogOut, Bell, ChefHat } from 'lucide-react';
import { cn } from '@/src/lib/utils';

type ProfileTab = 'profile' | 'saved' | 'my-recipes' | 'notifications' | 'settings';

interface ProfileButtonProps {
  onNavigate: (tab: ProfileTab) => void;
  onLogout: () => void;
}

export default function ProfileButton({ onNavigate, onLogout }: ProfileButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAction = (tab: ProfileTab) => {
    onNavigate(tab);
    setIsOpen(false);
  };

  return (
    <div className="relative z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 bg-white/80 backdrop-blur-md border border-orange-100 p-1.5 pr-4 rounded-full shadow-sm hover:shadow-md transition-all cursor-pointer group"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-orange-400 to-amber-300 flex items-center justify-center text-white shadow-inner overflow-hidden">
          <img 
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
            alt="Avatar" 
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-left hidden sm:block">
          <div className="text-[12px] font-bold text-[#1a0a00]">Николай</div>
          <div className="text-[10px] text-[#78716c]">Шеф-повар</div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-0" 
              onClick={() => setIsOpen(false)} 
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-3 w-64 bg-white rounded-[24px] shadow-2xl border border-orange-100/60 p-2 z-10"
            >
              <div className="p-4 border-b border-orange-50 mb-2">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xs font-bold text-orange-600 uppercase tracking-tighter bg-orange-50 px-2 py-0.5 rounded">Pro</span>
                  <span className="text-[11px] text-[#78716c]">1.2k подписчиков</span>
                </div>
                <div className="text-sm font-bold text-[#1a0a00]">Николай Кулинаров</div>
                <div className="text-[11px] text-[#78716c]">chef.nikolay@recipeworld.app</div>
              </div>

              <div className="space-y-1">
                <button
                  onClick={() => handleAction('profile')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 text-[#1a0a00] text-sm font-medium transition-colors cursor-pointer text-left"
                >
                  <User size={18} className="text-[#78716c]" />
                  Мой профиль
                </button>
                <button
                  onClick={() => handleAction('my-recipes')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 text-[#1a0a00] text-sm font-medium transition-colors cursor-pointer text-left"
                >
                  <ChefHat size={18} className="text-[#78716c]" />
                  Мои рецепты
                </button>
                <button
                  onClick={() => handleAction('saved')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 text-[#1a0a00] text-sm font-medium transition-colors cursor-pointer text-left"
                >
                  <Bookmark size={18} className="text-[#78716c]" />
                  Сохраненные
                </button>
                <button 
                  onClick={() => handleAction('notifications')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 text-[#1a0a00] text-sm font-medium transition-colors cursor-pointer text-left"
                >
                  <Bell size={18} className="text-[#78716c]" />
                  Уведомления
                </button>
                <button 
                  onClick={() => handleAction('settings')}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-orange-50 text-[#1a0a00] text-sm font-medium transition-colors cursor-pointer text-left"
                >
                  <Settings size={18} className="text-[#78716c]" />
                  Настройки
                </button>
              </div>

              <div className="mt-2 pt-2 border-t border-orange-50">
                <button 
                  onClick={() => {
                    onLogout();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-red-50 text-red-600 text-sm font-bold transition-colors cursor-pointer text-left"
                >
                  <LogOut size={18} />
                  Выйти
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
