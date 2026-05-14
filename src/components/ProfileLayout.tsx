import { useState, useRef, type ChangeEvent } from 'react';
import { motion } from 'motion/react';
import {
  User, Bookmark, Bell, Settings, LogOut, ArrowLeft,
  Camera, Mail, Shield, Smartphone, Heart, ChefHat, Sun, Moon, ShoppingCart
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import type { MockUser } from '../data/recipes';
import type { MyProfile } from '../lib/profile';
import { ImageProcessingError, processRecipeImage } from '../lib/image';

type Tab = 'profile' | 'saved' | 'notifications' | 'settings';

interface SavedRecipe {
  id: string | number;
  title: string;
  emoji: string;
  author: string;
  likes: string;
  time: string;
  gradient: string;
}

interface MyRecipe extends SavedRecipe {
  category?: string;
  difficulty?: string;
  timeRange?: string;
  createdAt?: number;
}

interface ProfileLayoutProps {
  key?: string;
  initialTab: Tab;
  savedRecipes?: SavedRecipe[];
  myRecipes?: MyRecipe[];
  followingCount?: number;
  followersCount?: number;
  onSelectRecipe?: (recipe: SavedRecipe) => void;
  onCreateRecipe?: () => void;
  onViewUser?: (user: MockUser) => void;
  onOpenFollowers?: () => void;
  onOpenFollowing?: () => void;
  onOpenRecipes?: () => void;
  theme?: 'light' | 'dark';
  onChangeTheme?: (theme: 'light' | 'dark') => void;
  profile?: MyProfile;
  onUpdateProfile?: (next: Partial<MyProfile>) => void;
  onOpenShoppingList?: () => void;
  onBack: () => void;
  onLogout: () => void;
}

const formatCount = (count: number) => {
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace('.0', '')}k`;
  return String(count);
};

export default function ProfileLayout({
  initialTab,
  savedRecipes = [],
  myRecipes = [],
  followingCount = 0,
  followersCount = 0,
  onSelectRecipe,
  onCreateRecipe,
  onOpenFollowers,
  onOpenFollowing,
  onOpenRecipes,
  theme = 'light',
  onChangeTheme,
  profile,
  onUpdateProfile,
  onOpenShoppingList,
  onBack,
  onLogout,
}: ProfileLayoutProps) {
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const avatarUrl = profile?.avatarUrl ?? 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix';
  const savedUsername = profile?.username ?? 'Шеф';
  const savedBio = profile?.bio ?? '';
  const [username, setUsername] = useState(savedUsername);
  const [bio, setBio] = useState(savedBio);
  const [avatarError, setAvatarError] = useState<string | null>(null);
  const [isProcessingAvatar, setIsProcessingAvatar] = useState(false);
  const hasChanges = username !== savedUsername || bio !== savedBio;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    setAvatarError(null);
    setIsProcessingAvatar(true);
    try {
      const processed = await processRecipeImage(file);
      onUpdateProfile?.({ avatarUrl: processed.dataUrl });
    } catch (err) {
      setAvatarError(err instanceof ImageProcessingError ? err.message : 'Не удалось обработать фото.');
    } finally {
      setIsProcessingAvatar(false);
    }
  };

  const handleSaveProfile = () => {
    onUpdateProfile?.({ username: username.trim() || savedUsername, bio: bio.trim() });
  };

  const tabs = [
    { id: 'profile', label: 'Мой профиль', icon: User },
    { id: 'saved', label: 'Сохраненные', icon: Bookmark },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ] as const;

  const formatRecipeCount = (count: number) => {
    if (count === 1) return `${count} рецепт`;
    if (count >= 2 && count <= 4) return `${count} рецепта`;
    return `${count} рецептов`;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen pt-8 sm:pt-12 px-4 sm:px-6 max-w-7xl mx-auto pb-32"
    >
      <header className="mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#78716c] dark:text-[#b5a89f] hover:text-[#D85A30] transition-colors mb-8 cursor-pointer group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="font-medium">Назад</span>
        </button>
        <h1 className="font-display text-4xl font-bold text-[#1a0a00] dark:text-orange-50">Личный кабинет</h1>
      </header>

      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Sidebar — vertical on desktop, horizontal scroll on mobile */}
        <aside className="w-full lg:w-64 shrink-0">
          <nav className="bg-white dark:bg-[#241410] border border-orange-100 dark:border-orange-900/30 rounded-[24px] lg:rounded-[32px] p-2 lg:space-y-1 shadow-sm flex lg:block gap-1 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3.5 rounded-2xl text-xs lg:text-sm font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 lg:w-full",
                  activeTab === tab.id
                    ? "bg-orange-50 text-[#D85A30]"
                    : "text-[#78716c] dark:text-[#b5a89f] hover:bg-slate-50",
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
            <button
              onClick={onLogout}
              className="flex items-center gap-2 lg:gap-3 px-3 lg:px-4 py-2.5 lg:py-3.5 rounded-2xl text-xs lg:text-sm font-bold text-red-500 hover:bg-red-50 transition-all cursor-pointer whitespace-nowrap shrink-0 lg:w-full lg:mt-2 lg:pt-2 lg:border-t lg:border-orange-50"
            >
              <LogOut size={18} />
              Выйти
            </button>
          </nav>
        </aside>

        {/* Content Area */}
        <main className="flex-1 bg-white dark:bg-[#241410] border border-orange-100 dark:border-orange-900/30 rounded-[32px] sm:rounded-[40px] p-5 sm:p-8 md:p-12 shadow-sm min-h-[600px]">
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
                    disabled={isProcessingAvatar}
                    aria-label="Загрузить новый аватар"
                    className={cn(
                      'absolute -bottom-2 -right-2 p-3 bg-[#D85A30] text-white rounded-2xl shadow-lg transition-transform cursor-pointer',
                      isProcessingAvatar ? 'cursor-wait opacity-70' : 'hover:scale-110',
                    )}
                  >
                    <Camera size={18} />
                  </button>
                </div>
                {avatarError && (
                  <div className="text-[11px] font-semibold text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-100 rounded-xl px-3 py-2">
                    {avatarError}
                  </div>
                )}
                <div className="text-center md:text-left flex-1">
                  <h2 className="text-2xl font-bold text-[#1a0a00] dark:text-orange-50 mb-1">{savedUsername}</h2>
                  {savedBio && <p className="text-sm text-[#78716c] dark:text-[#b5a89f] mb-3 max-w-sm">{savedBio}</p>}
                  <p className="text-[#78716c] dark:text-[#b5a89f] mb-4">Бронзовый шеф-повар</p>
                  <div className="flex flex-wrap gap-6 justify-center md:justify-start mb-4">
                    <button
                      onClick={onOpenFollowers}
                      className="flex items-baseline gap-2 px-3 py-1.5 -mx-3 -my-1.5 rounded-xl hover:bg-orange-50 transition-colors cursor-pointer"
                    >
                      <span className="text-xl font-bold text-[#1a0a00] dark:text-orange-50">{formatCount(followersCount)}</span>
                      <span className="text-xs text-[#78716c] dark:text-[#b5a89f] uppercase tracking-wider font-semibold">подписчиков</span>
                    </button>
                    <button
                      onClick={onOpenFollowing}
                      className="flex items-baseline gap-2 px-3 py-1.5 -mx-3 -my-1.5 rounded-xl hover:bg-orange-50 transition-colors cursor-pointer"
                    >
                      <span className="text-xl font-bold text-[#1a0a00] dark:text-orange-50">{formatCount(followingCount)}</span>
                      <span className="text-xs text-[#78716c] dark:text-[#b5a89f] uppercase tracking-wider font-semibold">подписок</span>
                    </button>
                    <button
                      onClick={onOpenRecipes}
                      className="flex items-baseline gap-2 px-3 py-1.5 -mx-3 -my-1.5 rounded-xl hover:bg-orange-50 transition-colors cursor-pointer"
                    >
                      <span className="text-xl font-bold text-[#1a0a00] dark:text-orange-50">{myRecipes.length}</span>
                      <span className="text-xs text-[#78716c] dark:text-[#b5a89f] uppercase tracking-wider font-semibold">рецептов</span>
                    </button>
                  </div>
                  <div className="flex gap-3 justify-center md:justify-start">
                    <span className="px-4 py-1.5 bg-orange-50 text-[#D85A30] rounded-full text-xs font-bold">PRO ACCOUNT</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <label className="text-sm font-bold text-[#1a0a00] dark:text-orange-50">Имя пользователя</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#1a0a00]/50 border border-orange-50 dark:border-orange-900/30 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                  />
                </div>
                <div className="space-y-4">
                  <label className="text-sm font-bold text-[#1a0a00] dark:text-orange-50">Email</label>
                  <input type="email" defaultValue="chef.nikolay@recipeworld.app" className="w-full bg-slate-50 dark:bg-[#1a0a00]/50 border border-orange-50 dark:border-orange-900/30 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-orange-200" />
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-[#1a0a00] dark:text-orange-50">О себе</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Расскажите о себе, своих кулинарных предпочтениях и любимых блюдах..."
                  rows={4}
                  maxLength={300}
                  className="w-full bg-slate-50 dark:bg-[#1a0a00]/50 border border-orange-50 dark:border-orange-900/30 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-orange-200 resize-none"
                />
                <p className="text-[11px] text-[#78716c] dark:text-[#b5a89f] text-right">{bio.length}/300</p>
              </div>

              {hasChanges && (
                <motion.button
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={handleSaveProfile}
                  className="bg-[#D85A30] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:shadow-lg shadow-orange-900/20 transition-all cursor-pointer"
                >
                  Подтвердить изменения
                </motion.button>
              )}
            </motion.div>
          )}

          {activeTab === 'saved' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
              <div className="flex flex-wrap justify-between items-center gap-3">
                <h2 className="text-2xl font-bold text-[#1a0a00] dark:text-orange-50">Сохраненные рецепты</h2>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-[#78716c] dark:text-[#b5a89f]">{formatRecipeCount(savedRecipes.length)}</span>
                  {onOpenShoppingList && (
                    <button
                      onClick={onOpenShoppingList}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs bg-orange-50 text-[#D85A30] hover:bg-orange-100 transition-colors cursor-pointer border border-orange-100"
                    >
                      <ShoppingCart size={14} />
                      Список покупок
                    </button>
                  )}
                </div>
              </div>
              {savedRecipes.length === 0 ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">🔖</div>
                  <h3 className="text-xl font-bold text-[#1a0a00] dark:text-orange-50 mb-2">Пока ничего не сохранено</h3>
                  <p className="text-[#78716c] dark:text-[#b5a89f]">Откройте любой рецепт и нажмите на закладку — он появится здесь.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedRecipes.map(recipe => (
                    <div
                      key={String(recipe.id)}
                      onClick={() => onSelectRecipe?.(recipe)}
                      className="group bg-slate-50 rounded-3xl p-4 flex gap-4 hover:bg-orange-50 transition-colors cursor-pointer"
                    >
                      <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center text-3xl shrink-0">
                        {recipe.emoji}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-sm text-[#1a0a00] dark:text-orange-50 mb-2">{recipe.title}</h3>
                        <div className="flex items-center gap-3 text-[10px] text-[#78716c] dark:text-[#b5a89f]">
                          <span className="flex items-center gap-1 font-bold">❤️ {recipe.likes}</span>
                          <span className="flex items-center gap-1 font-bold">⏱ {recipe.time}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'notifications' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
              <h2 className="text-2xl font-bold text-[#1a0a00] dark:text-orange-50 mb-8">Уведомления</h2>
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
                      <h4 className="text-sm font-bold text-[#1a0a00] dark:text-orange-50">{notif.title}</h4>
                      <p className="text-[11px] text-[#78716c] dark:text-[#b5a89f]">{notif.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-12">
              <h2 className="text-2xl font-bold text-[#1a0a00] dark:text-orange-50 dark:text-orange-50">Настройки аккаунта</h2>

              <div className="space-y-6">
                <h3 className="text-sm font-bold text-orange-600 uppercase tracking-widest">Внешний вид</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => onChangeTheme?.('light')}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer text-left',
                      theme === 'light'
                        ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-300'
                        : 'bg-slate-50 dark:bg-[#1a0a00]/40 border-transparent hover:border-orange-200',
                    )}
                  >
                    <Sun size={20} className="text-orange-500" />
                    <div>
                      <div className="text-sm font-bold text-[#1a0a00] dark:text-orange-50 dark:text-orange-50">Светлая</div>
                      <div className="text-[11px] text-[#78716c] dark:text-[#b5a89f] dark:text-[#b5a89f]">Дневная тема</div>
                    </div>
                  </button>
                  <button
                    onClick={() => onChangeTheme?.('dark')}
                    className={cn(
                      'flex items-center gap-3 p-4 rounded-2xl border-2 transition-all cursor-pointer text-left',
                      theme === 'dark'
                        ? 'bg-orange-50 dark:bg-orange-900/20 border-orange-300'
                        : 'bg-slate-50 dark:bg-[#1a0a00]/40 border-transparent hover:border-orange-200',
                    )}
                  >
                    <Moon size={20} className="text-indigo-400" />
                    <div>
                      <div className="text-sm font-bold text-[#1a0a00] dark:text-orange-50 dark:text-orange-50">Тёмная</div>
                      <div className="text-[11px] text-[#78716c] dark:text-[#b5a89f] dark:text-[#b5a89f]">Бережёт глаза</div>
                    </div>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-sm font-bold text-orange-600 uppercase tracking-widest">Безопасность</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Shield size={20} className="text-[#78716c] dark:text-[#b5a89f]" />
                      <div className="text-sm font-bold text-[#1a0a00] dark:text-orange-50">Двухфакторная аутентификация</div>
                    </div>
                    <div className="w-10 h-5 bg-orange-400 rounded-full relative">
                      <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full shadow-sm" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                    <div className="flex items-center gap-3">
                      <Smartphone size={20} className="text-[#78716c] dark:text-[#b5a89f]" />
                      <div className="text-sm font-bold text-[#1a0a00] dark:text-orange-50">Вход по номеру телефона</div>
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
