import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock, Heart, ChefHat, Share2, Bookmark, Check } from 'lucide-react';
import { findUserByName, MockUser } from '../data/recipes';
interface RecipeDetailRecipe {
  id: string | number;
  title: string;
  emoji: string;
  author: string;
  likes: string;
  time: string;
  gradient: string;
  imageUrl?: string;
  description?: string;
  ingredients?: string[];
  steps?: string[];
}

interface RecipeDetailProps {
  recipe: RecipeDetailRecipe;
  onBack: () => void;
  isSaved?: boolean;
  onToggleSave?: (recipe: RecipeDetailRecipe) => void;
  onViewUser?: (user: MockUser) => void;
}

export default function RecipeDetail({ recipe, onBack, isSaved, onToggleSave, onViewUser }: RecipeDetailProps) {
  const authorUser = findUserByName(recipe.author);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(recipe.likes);
  const [shareToast, setShareToast] = useState(false);
  const recipeSaved = Boolean(isSaved);

  const handleLike = () => {
    setIsLiked(!isLiked);
    const num = parseFloat(likeCount.replace('k', '')) * (likeCount.includes('k') ? 1000 : 1);
    const next = isLiked ? num - 1 : num + 1;
    setLikeCount(next >= 1000 ? (next / 1000).toFixed(1).replace('.0', '') + 'k' : String(next));
  };

  const handleShare = async () => {
    const data = { title: recipe.title, text: `Посмотри рецепт: ${recipe.title}`, url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(data); } catch {}
    } else {
      await navigator.clipboard.writeText(`${recipe.title} — ${window.location.href}`);
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen pt-12 px-6 max-w-4xl mx-auto pb-32"
      id="recipe-detail"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#78716c] hover:text-[#D85A30] transition-colors mb-8 cursor-pointer group"
        id="back-button"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Вернуться на главную</span>
      </button>

      <div className="bg-white rounded-[40px] border border-orange-100/60 overflow-hidden shadow-2xl shadow-orange-900/5" id="recipe-card-full">
        {/* Header Image/Emoji */}
        <div
          className={`relative h-[300px] flex items-center justify-center text-9xl bg-gradient-to-br ${recipe.gradient} overflow-hidden`}
          id="recipe-header"
        >
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <span>{recipe.emoji}</span>
          )}
        </div>

        <div className="p-8 md:p-12">
          <div className="flex flex-wrap items-start justify-between gap-6 mb-8">
            <div>
              <div className="inline-block px-3 py-1 bg-orange-100 rounded-full text-[10px] font-bold text-orange-600 mb-4 uppercase tracking-wider">Рецепт дня</div>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-[#1a0a00] mb-4">{recipe.title}</h2>

              <div className="flex flex-wrap items-center gap-6">
                <div
                  onClick={() => onViewUser?.(authorUser)}
                  className="flex items-center gap-3 cursor-pointer group/author"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-lg shadow-sm overflow-hidden">
                    <img src={authorUser.avatar} alt={authorUser.name} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-[11px] text-[#78716c] font-medium">Автор рецепта</div>
                    <div className="text-sm font-semibold text-[#1a0a00] group-hover/author:text-[#D85A30] transition-colors">{authorUser.name}</div>
                  </div>
                </div>

                <div className="h-8 w-px bg-orange-100 hidden md:block" />

                <div className="flex gap-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-400" />
                    <span className="text-sm font-medium text-[#78716c]">{recipe.time}</span>
                  </div>
                  <button onClick={handleLike} className="flex items-center gap-2 cursor-pointer group/like">
                    <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'text-red-500 fill-red-500' : 'text-orange-400 fill-orange-400/10 group-hover/like:text-red-400'}`} />
                    <span className="text-sm font-medium text-[#78716c]">{likeCount} лайков</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 relative">
              <button
                onClick={handleLike}
                className={`p-3 rounded-2xl transition-colors cursor-pointer border ${isLiked ? 'bg-red-50 text-red-500 border-red-100' : 'bg-slate-50 hover:bg-red-50 hover:text-red-500 border-transparent hover:border-red-100'}`}
              >
                <Heart size={20} className={isLiked ? 'fill-red-500' : ''} />
              </button>
              <button
                onClick={handleShare}
                className="p-3 bg-slate-50 rounded-2xl hover:bg-orange-50 hover:text-orange-600 transition-colors cursor-pointer border border-transparent hover:border-orange-100"
              >
                <Share2 size={20} />
              </button>
              <button
                onClick={() => onToggleSave?.(recipe)}
                className={`p-3 rounded-2xl transition-colors cursor-pointer border ${recipeSaved ? 'bg-orange-50 text-[#D85A30] border-orange-200' : 'bg-slate-50 hover:bg-orange-50 hover:text-orange-600 border-transparent hover:border-orange-100'}`}
              >
                <Bookmark size={20} className={recipeSaved ? 'fill-[#D85A30]' : ''} />
              </button>

              {/* Share toast */}
              <AnimatePresence>
                {shareToast && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute -bottom-12 right-0 bg-[#1a0a00] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap"
                  >
                    <Check size={14} /> Ссылка скопирована
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {recipe.description && (
            <p className="text-[15px] leading-relaxed text-[#78716c] pb-2 -mt-2">
              {recipe.description}
            </p>
          )}

          <div className="grid md:grid-cols-3 gap-12 pt-8 border-t border-orange-50">
            <div className="md:col-span-1">
              <h4 className="font-display text-xl font-bold text-[#1a0a00] mb-6 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-orange-500" />
                Ингредиенты
              </h4>
              <ul className="space-y-4">
                {(recipe.ingredients && recipe.ingredients.length > 0
                  ? recipe.ingredients
                  : [
                      'Ингредиент #1 для идеальной пасты',
                      'Ингредиент #2 для идеальной пасты',
                      'Ингредиент #3 для идеальной пасты',
                      'Ингредиент #4 для идеальной пасты',
                      'Ингредиент #5 для идеальной пасты',
                    ]
                ).map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-3 text-[#78716c] text-sm leading-relaxed">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-300 shrink-0 mt-2" />
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="md:col-span-2">
              <h4 className="font-display text-xl font-bold text-[#1a0a00] mb-6">Способ приготовления</h4>
              <div className="space-y-8">
                {(recipe.steps && recipe.steps.length > 0
                  ? recipe.steps
                  : [
                      'Подробное описание того, как именно нужно готовить это потрясающее блюдо. Сначала подготовьте все необходимое, затем приступайте к основному процессу. Не забудьте добавить щепотку любви!',
                      'Продолжайте готовить, аккуратно следуя классическому методу. Прислушивайтесь к ингредиентам — они подскажут, когда всё готово.',
                      'Подайте блюдо горячим, украсив зеленью и любимыми специями. Приятного аппетита!',
                    ]
                ).map((stepText, index) => (
                  <div key={index} className="flex gap-6">
                    <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 font-bold flex items-center justify-center shrink-0 border border-orange-100">
                      {index + 1}
                    </div>
                    <div>
                      <h5 className="font-bold text-[#1a0a00] mb-2">Шаг {index + 1}</h5>
                      <p className="text-sm leading-relaxed text-[#78716c] whitespace-pre-wrap">{stepText}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
