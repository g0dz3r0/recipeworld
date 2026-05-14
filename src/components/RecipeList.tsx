import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Search, Plus, Heart, Clock } from 'lucide-react';

export interface RecipeListRecipe {
  id: string | number;
  title: string;
  emoji: string;
  author: string;
  likes: string;
  time: string;
  imageUrl?: string;
  difficulty?: string;
  gradient?: string;
  tags?: string[];
  description?: string;
  ingredients?: string[];
  steps?: string[];
}

interface RecipeListProps {
  title: string;
  subtitle?: string;
  recipes: RecipeListRecipe[];
  emptyStateEmoji?: string;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
  onBack: () => void;
  onSelectRecipe?: (recipe: RecipeListRecipe) => void;
  onCreateRecipe?: () => void;
}

export default function RecipeList({
  title,
  subtitle,
  recipes,
  emptyStateEmoji = '🍽️',
  emptyStateTitle = 'Рецептов пока нет',
  emptyStateDescription = 'Здесь пока пусто.',
  onBack,
  onSelectRecipe,
  onCreateRecipe,
}: RecipeListProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return recipes;
    return recipes.filter(r =>
      r.title.toLowerCase().includes(q) || r.author.toLowerCase().includes(q),
    );
  }, [recipes, query]);

  const difficultyLabel = (d?: string) => {
    if (d === 'easy') return 'легко';
    if (d === 'medium') return 'средне';
    if (d === 'hard') return 'сложно';
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen pt-8 sm:pt-12 px-4 sm:px-6 max-w-5xl mx-auto pb-32"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#78716c] hover:text-[#D85A30] transition-colors mb-8 cursor-pointer group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Назад</span>
      </button>

      <div className="bg-white rounded-[40px] border border-orange-100/60 shadow-2xl shadow-orange-900/5 overflow-hidden">
        <header className="px-8 pt-8 pb-6 border-b border-orange-50">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-[#1a0a00]">{title}</h1>
              {subtitle && <p className="text-sm text-[#78716c] mt-1">{subtitle}</p>}
            </div>
            {onCreateRecipe && (
              <button
                onClick={onCreateRecipe}
                className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm bg-[#D85A30] text-white hover:shadow-lg shadow-orange-200 transition-all cursor-pointer"
              >
                <Plus size={16} />
                Создать рецепт
              </button>
            )}
          </div>
          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716c] w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по названию или автору…"
              className="w-full bg-slate-50 border border-orange-100 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
            />
          </div>
          <p className="text-[11px] text-[#78716c] mt-3 uppercase tracking-wider font-bold">
            {filtered.length} {pluralize(filtered.length, 'рецепт', 'рецепта', 'рецептов')}
          </p>
        </header>

        {filtered.length === 0 ? (
          <div className="text-center py-20 px-6">
            <div className="text-6xl mb-4">{recipes.length === 0 ? emptyStateEmoji : '🔍'}</div>
            <h3 className="text-xl font-bold text-[#1a0a00] mb-2">
              {recipes.length === 0 ? emptyStateTitle : 'Ничего не найдено'}
            </h3>
            <p className="text-[#78716c] mb-6">
              {recipes.length === 0 ? emptyStateDescription : 'Попробуйте изменить запрос.'}
            </p>
            {recipes.length === 0 && onCreateRecipe && (
              <button
                onClick={onCreateRecipe}
                className="inline-flex items-center gap-2 bg-[#D85A30] text-white px-6 py-3 rounded-2xl font-bold text-sm hover:shadow-lg shadow-orange-900/20 transition-all cursor-pointer"
              >
                <Plus size={16} />
                Создать первый рецепт
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {filtered.map(recipe => {
              const diff = difficultyLabel(recipe.difficulty);
              return (
                <div
                  key={String(recipe.id)}
                  onClick={() => onSelectRecipe?.(recipe)}
                  className="group bg-slate-50 rounded-3xl overflow-hidden hover:bg-orange-50 transition-colors cursor-pointer"
                >
                  <div className={`relative h-32 bg-gradient-to-br ${recipe.gradient ?? 'from-orange-50 to-amber-50'} overflow-hidden flex items-center justify-center text-4xl`}>
                    {recipe.imageUrl ? (
                      <img
                        src={recipe.imageUrl}
                        alt={recipe.title}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <span>{recipe.emoji}</span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-[#1a0a00] mb-1 truncate">{recipe.title}</h3>
                    <p className="text-[11px] text-[#78716c] mb-3 truncate">by {recipe.author}</p>
                    <div className="flex items-center flex-wrap gap-2 text-[10px] text-[#78716c]">
                      <span className="flex items-center gap-1 font-bold">
                        <Heart size={10} /> {recipe.likes}
                      </span>
                      <span className="flex items-center gap-1 font-bold">
                        <Clock size={10} /> {recipe.time}
                      </span>
                      {diff && (
                        <span className="px-2 py-0.5 rounded-full bg-orange-100 text-orange-600 font-bold uppercase tracking-wider">
                          {diff}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function pluralize(count: number, one: string, few: string, many: string): string {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}
