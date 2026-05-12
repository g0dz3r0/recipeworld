import { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  User, Bookmark, Bell, Settings, LogOut, ArrowLeft,
  Camera, Mail, Shield, Smartphone, Heart, Clock, ChefHat
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { MOCK_RECIPES } from '../data/recipes';

type Tab = 'profile' | 'saved' | 'notifications' | 'settings';

interface ProfileLayoutProps {
  key?: string;
  initialTab: Tab;
  onBack: () => void;
  onLogout: () => void;
}

export default function ProfileLayout({ initialTab, onBack, onLogout }: ProfileLayoutProps) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [avatarUrl, setAvatarUrl] = useState('https://api.dicebear.com/7.x/avataaars/svg?seed=Felix');
  const [username, setUsername] = useState('Николай Кулинаров');
  const [savedUsername, setSavedUsername] = useState('Николай Кулинаров');
  const [bio, setBio] = useState('');
  const [savedBio, setSavedBio] = useState('');
  const hasChanges = username !== savedUsername || bio !== savedBio;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const tabs = [
    { id: 'profile', label: 'Мой профиль', icon: User },
    { id: 'saved', label: 'Сохраненные', icon: Bookmark },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ] as const;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen pt-12 px-6 max-w-7xl mx-auto pb-32"
    >
      <header className="mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#78716c] hover:text-[#D85A30] transition-colors mb-8 cursor-pointer group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Назад</span>
        </button>
        <h1 className="font-display text-4xl font-bold text-[#1a0a00]">Личный кабинет</h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <nav className="bg-white border border-orange-100 rounded-[32px] p-2 space-y-1 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all cursor-pointer",
                  activeTab === tab.id 
                    ? "bg-orange-50 text-[#D85A30]" 
                    : "text-[#78716c] hover:bg-slate-50"
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
            <div className="pt-2 mt-2 border-t border-orange-50">
              <button 
                onClick={onLogout}
                className="w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all cursor-pointer"
              >
                <LogOut size={18} />
                Выйти
              </button>
            </div>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white border border-orange-100 rounded-[40px] p-8 md:p-12 shadow-sm min-h-[600px]">
          {activeTab === 'profile' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="relative group">
                  <div className="w-32 h-32 rounded-[40px] bg-gradient-to-tr from-orange-400 to-amber-300 p-1 shadow-xl">
                    <img
                      src={avatarUrl}
                      alt="Avatar"
                      className="w-full h-full object-cover rounded-[38px] bg-white"
                    />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleAvatarChange}
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 p-3 bg-[#D85A30] text-white rounded-2xl shadow-lg hover:scale-110 transition-transform cursor-pointer"
                  >
                    <Camera size={18} />
                  </button>
                </div>
                <div className="text-center md:text-left">
                  <h2 className="text-2xl font-bold text-[#1a0a00] mb-1">{savedUsername}</h2>
                  {savedBio && <p className="text-sm text-[#78716c] mb-3 max-w-sm">{savedBio}</p>}
                  <p className="text-[#78716c] mb-4">Бронзовый шеф-повар • 1.2k подписчиков</p>
                  <div className="flex gap-3 justify-center md:justify-start">
                    <span className="px-4 py-1.5 bg-orange-50 text-[#D85A30] rounded-full text-xs font-bold">PRO ACCOUNT</span>
                    <span className="px-4 py-1.5 bg-slate-50 text-[#78716c] rounded-full text-xs font-bold">128 РЕЦЕПТОВ</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-[#1a0a00]">Имя пользователя</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50 border border-orange-50 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-bold text-[#1a0a00]">Email</label>
                  <input type="email" defaultValue="chef.nikolay@recipeworld.app" className="w-full bg-slate-50 border border-orange-50 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-[#1a0a00]">О себе</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Расскажите о себе, своих кулинарных предпочтениях и любимых блюдах..."
                  rows={4}
                  maxLength={300}
                  className="w-full bg-slate-50 border border-orange-50 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-orange-200 resize-none"
                />
                <p className="text-[11px] text-[#78716c] text-right">{bio.length}/300</p>
              </div>

              {hasChanges && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => { setSavedUsername(username); setSavedBio(bio); }}
                  className="bg-[#D85A30] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:shadow-lg shadow-orange-900/20 transition-all cursor-pointer"
                >
                  Подтвердить изменения
                </motion.button>
              )}
            </motion.div>
          )}

          {activeTab === 'saved' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#1a0a00]">Сохраненные рецепты</h2>
                <span className="text-sm text-[#78716c]">{MOCK_RECIPES.length} рецептов</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {MOCK_RECIPES.slice(0, 4).map(recipe => (
                  <div key={recipe.id} className="group bg-slate-50 rounded-3xl p-4 flex gap-4 hover:bg-orange-50 transition-colors cursor-pointer">
                    <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-3xl shrink-0">
                      {recipe.emoji}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-sm text-[#1a0a00] mb-2">{recipe.title}</h3>
                      <div className="flex items-center gap-3 text-[10px] text-[#78716c]">
                        <span className="flex items-center gap-1 font-bold">❤️ {recipe.likes}</span>
                        <span className="flex items-center gap-1 font-bold">⏱ {recipe.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1a0a00] mb-8">Уведомления</h2>
              <div className="space-y-4">
                {[
                  { title: 'Ваш рецепт лайкнули!', time: '2 минуты назад', icon: Heart, color: 'text-red-500' },
                  { title: 'Новый комментарий под пастой', time: '1 час назад', icon: Mail, color: 'text-blue-500' },
                  { title: 'Подборка рецептов на выходные', time: '5 часов назад', icon: ChefHat, color: 'text-orange-500' },
                ].map((notif, i) => (
                  <div key={i} className="flex gap-4 p-4 rounded-2xl border border-orange-50 hover:bg-orange-50 transition-colors cursor-pointer">
                    <div className={cn("w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm", notif.color)}>
                      <notif.icon size={18} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#1a0a00]">{notif.title}</h4>
                      <p className="text-[11px] text-[#78716c]">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
              <h2 className="text-2xl font-bold text-[#1a0a00]">Настройки аккаунта</h2>
              
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-orange-600 uppercase tracking-widest">Безопасность</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Shield size={20} className="text-[#78716c]" />
                      <div className="text-sm font-bold text-[#1a0a00]">Двухфакторная аутентификация</div>
                    </div>
                    <div className="w-10 h-5 bg-orange-400 rounded-full relative">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Smartphone size={20} className="text-[#78716c]" />
                      <div className="text-sm font-bold text-[#1a0a00]">Вход по номеру телефона</div>
                    </div>
                    <div className="w-10 h-5 bg-slate-300 rounded-full relative">
                      <div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-8">
                <button className="bg-[#D85A30] text-white px-8 py-4 rounded-2xl font-bold hover:shadow-lg shadow-orange-900/20 transition-all cursor-pointer">
                  Сохранить изменения
                </button>
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </motion.div>
  );
}
