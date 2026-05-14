import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Search, Filter, Clock, Heart, Sparkles, Plus } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { MOCK_RECIPES, CATEGORIES, findUserByName, MockUser } from '../data/recipes';
import ProfileButton from './ProfileButton';
import FridgeButton from './FridgeButton';

interface ExtraRecipe {
  id: string | number;
  title: string;
  emoji: string;
  author: string;
  likes: string;
  time: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  timeRange: '<15' | '15-30' | '>30';
  gradient?: string;
  imageUrl?: string;
  tags?: string[];
  createdAt?: number;
}

const TAG_OPTIONS: { id: string; label: string; emoji: string }[] = [
  { id: 'vegetarian', label: 'Вегетарианское', emoji: '🌱' },
  { id: 'vegan', label: 'Веганское', emoji: '🥬' },
  { id: 'gluten-free', label: 'Без глютена', emoji: '🌾' },
  { id: 'spicy', label: 'Острое', emoji: '🌶️' },
  { id: 'kids', label: 'Детям', emoji: '🧒' },
  { id: 'quick', label: 'Быстрое', emoji: '⏱' },
  { id: 'budget', label: 'Бюджетное', emoji: '💰' },
  { id: 'healthy', label: 'ЗОЖ', emoji: '💪' },
];

interface RecipesExplorerProps {
  onBack: () => void;
  onSelectRecipe: (recipe: any) => void;
  onAIClick: () => void;
  onNavigateProfile?: (tab: any) => void;
  onLogout?: () => void;
  onViewUser?: (user: MockUser) => void;
  extraRecipes?: ExtraRecipe[];
  onCreateRecipe?: () => void;
  profileAvatarUrl?: string;
  profileUsername?: string;
}

export default function RecipesExplorer({ onBack, onSelectRecipe, onAIClick, onNavigateProfile, onLogout, onViewUser, extraRecipes = [], onCreateRecipe, profileAvatarUrl, profileUsername }: RecipesExplorerProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [difficulty, setDifficulty] = useState('all');
  const [timeRange, setTimeRange] = useState('all');
  const [activeTags, setActiveTags] = useState<string[]>([]);

  const toggleTag = (tag: string) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const sortedExtras = [...extraRecipes].sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0));
  type DisplayRecipe = ExtraRecipe;
  const allRecipes: DisplayRecipe[] = [
    ...sortedExtras,
    ...MOCK_RECIPES.map<DisplayRecipe>(r => ({
      ...r,
      difficulty: r.difficulty as 'easy' | 'medium' | 'hard',
      timeRange: r.timeRange as '<15' | '15-30' | '>30',
    })),
  ];
  const filteredRecipes = allRecipes.filter(recipe => {
    const matchesCategory = activeCategory === 'all' || recipe.category === activeCategory;
    const matchesSearch = recipe.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDifficulty = difficulty === 'all' || recipe.difficulty === difficulty;
    const matchesTime = timeRange === 'all' || recipe.timeRange === timeRange;
    const recipeTags = recipe.tags ?? [];
    const matchesTags = activeTags.length === 0 || activeTags.every(t => recipeTags.includes(t));
    return matchesCategory && matchesSearch && matchesDifficulty && matchesTime && matchesTags;
  });

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-8 sm:pt-12 px-4 sm:px-6 max-w-7xl mx-auto pb-32"
      id="recipes-explorer"
    >
      <header className="mb-12 relative">
        <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-[#78716c] hover:text-[#D85A30] transition-colors cursor-pointer group"
            id="back-button"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">На главную</span>
          </button>

          {/* Right Section: Profile and Fridge */}
          <div className="flex flex-col items-center gap-6 md:order-last">
            <ProfileButton
              onNavigate={(tab) => onNavigateProfile?.(tab)}
              onLogout={() => onLogout?.()}
              avatarUrl={profileAvatarUrl}
              username={profileUsername}
            />
            <FridgeButton onClick={onAIClick} />
          </div>
        </div>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a0a00] mb-6 sm:mb-8">Исследуйте мир вкусов</h1>
        
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716c] w-5 h-5" />
            <input 
              type="text" 
              placeholder="Поиск рецептов..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-orange-100 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all shadow-sm"
            />
          </div>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(
              "px-6 py-4 rounded-2xl flex items-center justify-center gap-2 font-medium transition-all shadow-sm border cursor-pointer",
              isFilterOpen
                ? "bg-orange-50 border-orange-300 text-[#D85A30]"
                : "bg-white border-orange-100 text-[#1a0a00] hover:bg-orange-50"
            )}
          >
            <Filter className="w-5 h-5" />
            <span>Фильтры</span>
          </button>
          {onCreateRecipe && (
            <button
              onClick={onCreateRecipe}
              className="px-6 py-4 rounded-2xl flex items-center justify-center gap-2 font-bold transition-all shadow-md shadow-orange-200 border cursor-pointer bg-[#D85A30] text-white border-[#D85A30] hover:bg-[#B84820]"
            >
              <Plus className="w-5 h-5" />
              <span>Создать рецепт</span>
            </button>
          )}
        </div>

        <AnimatePresence>
          {isFilterOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-8"
            >
              <div className="bg-white border border-orange-100 rounded-[32px] p-6 shadow-sm flex flex-wrap gap-8">
                <div className="space-y-3">
                  <h4 className="text-[14px] font-bold text-[#1a0a00]">Сложность</h4>
                  <div className="flex gap-2">
                    {[
                      { id: 'all', label: 'Все' },
                      { id: 'easy', label: 'Легко' },
                      { id: 'medium', label: 'Средне' },
                      { id: 'hard', label: 'Сложно' }
                    ].map(opt => (
                      <button 
                        key={opt.id}
                        onClick={() => setDifficulty(opt.id)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-[12px] font-semibold border transition-all cursor-pointer",
                          difficulty === opt.id 
                            ? "bg-orange-100 border-orange-300 text-[#D85A30]" 
                            : "bg-slate-50 border-transparent text-[#78716c] hover:bg-orange-50"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-[14px] font-bold text-[#1a0a00]">Время готовки</h4>
                  <div className="flex gap-2">
                    {[
                      { id: 'all', label: 'Любое' },
                      { id: '<15', label: '< 15 мин' },
                      { id: '15-30', label: '15-30 мин' },
                      { id: '>30', label: '> 30 мин' }
                    ].map(opt => (
                      <button 
                        key={opt.id}
                        onClick={() => setTimeRange(opt.id)}
                        className={cn(
                          "px-4 py-2 rounded-xl text-[12px] font-semibold border transition-all cursor-pointer",
                          timeRange === opt.id 
                            ? "bg-orange-100 border-orange-300 text-[#D85A30]" 
                            : "bg-slate-50 border-transparent text-[#78716c] hover:bg-orange-50"
                        )}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3 basis-full">
                  <h4 className="text-[14px] font-bold text-[#1a0a00]">Теги</h4>
                  <div className="flex flex-wrap gap-2">
                    {TAG_OPTIONS.map(tag => {
                      const active = activeTags.includes(tag.id);
                      return (
                        <button
                          key={tag.id}
                          onClick={() => toggleTag(tag.id)}
                          aria-pressed={active}
                          className={cn(
                            'flex items-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold border transition-all cursor-pointer',
                            active
                              ? 'bg-orange-100 border-orange-300 text-[#D85A30]'
                              : 'bg-slate-50 border-transparent text-[#78716c] hover:bg-orange-50',
                          )}
                        >
                          <span>{tag.emoji}</span>
                          {tag.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <button
                  onClick={() => {
                    setDifficulty('all');
                    setTimeRange('all');
                    setSearchQuery('');
                    setActiveCategory('all');
                    setActiveTags([]);
                  }}
                  className="mt-auto mb-1 text-[12px] font-bold text-[#D85A30] hover:underline cursor-pointer"
                >
                  Сбросить всё
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-3 overflow-x-auto pb-4 no-scrollbar" id="category-filters">
          {CATEGORIES.map(category => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "px-6 py-3 rounded-2xl text-sm font-semibold whitespace-nowrap transition-all border flex items-center gap-2 shadow-sm",
                activeCategory === category.id 
                  ? "bg-[#D85A30] text-white border-[#D85A30] shadow-orange-200" 
                  : "bg-white text-[#78716c] border-orange-100 hover:border-orange-300"
              )}
            >
              <span>{category.emoji}</span>
              {category.name}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" id="recipes-list">
        <AnimatePresence mode="popLayout">
          {filteredRecipes.map(recipe => (
            <motion.div
              layout
              key={recipe.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              onClick={() => onSelectRecipe({ ...recipe, gradient: recipe.gradient ?? 'from-orange-50 to-amber-50' })}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectRecipe({ ...recipe, gradient: recipe.gradient ?? 'from-orange-50 to-amber-50' });
                }
              }}
              role="button"
              tabIndex={0}
              aria-label={`Открыть рецепт: ${recipe.title}`}
              className="group bg-white rounded-[32px] border border-orange-100/60 p-5 shadow-sm hover:shadow-xl hover:shadow-orange-900/5 transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2"
            >
              <div className="relative h-40 bg-orange-50 rounded-2xl mb-4 overflow-hidden flex items-center justify-center text-5xl group-hover:scale-105 transition-transform duration-500">
                {recipe.imageUrl ? (
                  <img
                    src={recipe.imageUrl}
                    alt={recipe.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <span>{recipe.emoji}</span>
                )}
              </div>
              <h3 className="font-display font-semibold text-[#1a0a00] mb-2">{recipe.title}</h3>
              <div
                className="flex items-center gap-2 mb-4 group/author"
                onClick={(e) => {
                  e.stopPropagation();
                  onViewUser?.(findUserByName(recipe.author));
                }}
              >
                <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center text-[9px] text-orange-600 font-bold overflow-hidden">
                  <img src={findUserByName(recipe.author).avatar} alt="" className="w-full h-full object-cover" />
                </div>
                <span className="text-[12px] text-[#78716c] group-hover/author:text-[#D85A30] transition-colors">by {recipe.author}</span>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-orange-50">
                <span className="flex items-center gap-1.5 text-[12px] text-[#78716c] font-medium"><Heart size={14} className="text-orange-400" /> {recipe.likes}</span>
                <span className="flex items-center gap-1.5 text-[12px] text-[#78716c] font-medium"><Clock size={14} /> {recipe.time}</span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-20 max-w-md mx-auto">
          <div className="text-6xl mb-4" aria-hidden="true">🔍</div>
          <h3 className="text-xl font-bold text-[#1a0a00] mb-2">Ничего не найдено</h3>
          <p className="text-[#78716c] mb-6">
            {searchQuery
              ? `По запросу «${searchQuery}» нет рецептов. Попробуйте другие слова или сбросьте фильтры.`
              : 'В этой категории нет рецептов с такими фильтрами. Можно создать свой или сбросить фильтры.'}
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <button
              onClick={() => {
                setDifficulty('all');
                setTimeRange('all');
                setSearchQuery('');
                setActiveCategory('all');
                setActiveTags([]);
              }}
              className="px-5 py-3 rounded-2xl font-bold text-sm bg-slate-50 text-[#1a0a00] hover:bg-orange-50 transition-colors cursor-pointer border border-orange-100"
            >
              Сбросить фильтры
            </button>
            {onCreateRecipe && (
              <button
                onClick={onCreateRecipe}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm bg-[#D85A30] text-white hover:shadow-lg shadow-orange-900/20 transition-all cursor-pointer"
              >
                <Plus size={16} />
                Создать рецепт
              </button>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
}
