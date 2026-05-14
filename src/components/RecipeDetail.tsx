import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ArrowLeft, Clock, Heart, ChefHat, Share2, Bookmark, Check, Star,
  MessageCircle, Trash2, Pencil, Send,
} from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { findUserByName, MockUser } from '../data/recipes';
import type { RecipeComment } from '../lib/interactions';

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
  tags?: string[];
}

interface RecipeDetailProps {
  recipe: RecipeDetailRecipe;
  onBack: () => void;
  isSaved?: boolean;
  onToggleSave?: (recipe: RecipeDetailRecipe) => void;
  onViewUser?: (user: MockUser) => void;
  /** Persistent like state from parent. */
  isLiked?: boolean;
  onToggleLike?: () => void;
  /** Persistent star rating (1–5, 0 means unrated). */
  rating?: number;
  onSetRating?: (rating: number) => void;
  /** Comment thread. */
  comments?: RecipeComment[];
  currentUserName?: string;
  currentUserAvatar?: string;
  onAddComment?: (text: string) => void;
  onRemoveComment?: (commentId: string) => void;
  /** Owner controls — shown only for the current user's own drafts. */
  canEdit?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
}

const TAG_LABELS: Record<string, string> = {
  vegetarian: '🌱 Вегетарианское',
  vegan: '🥬 Веганское',
  'gluten-free': '🌾 Без глютена',
  spicy: '🌶️ Острое',
  kids: '🧒 Детям',
  quick: '⏱ Быстрое',
  budget: '💰 Бюджетное',
  healthy: '💪 ЗОЖ',
};

export default function RecipeDetail({
  recipe,
  onBack,
  isSaved,
  onToggleSave,
  onViewUser,
  isLiked = false,
  onToggleLike,
  rating = 0,
  onSetRating,
  comments = [],
  currentUserName = 'Вы',
  currentUserAvatar = 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
  onAddComment,
  onRemoveComment,
  canEdit,
  onEdit,
  onDelete,
}: RecipeDetailProps) {
  const authorUser = findUserByName(recipe.author);
  const [shareToast, setShareToast] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);
  const [draftComment, setDraftComment] = useState('');
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const recipeSaved = Boolean(isSaved);

  // Approximate "real" like count: parse the recipe's static count + bump if I
  // liked it. Looks more believable than just toggling 0/1.
  const baseCount = parseLikeCount(recipe.likes);
  const displayCount = formatLikeCount(baseCount + (isLiked ? 1 : 0));

  const handleShare = async () => {
    const data = { title: recipe.title, text: `Посмотри рецепт: ${recipe.title}`, url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(data); } catch { /* user cancelled */ }
    } else {
      try {
        await navigator.clipboard.writeText(`${recipe.title} — ${window.location.href}`);
        setShareToast(true);
        setTimeout(() => setShareToast(false), 2000);
      } catch {
        // ignore — clipboard might be blocked
      }
    }
  };

  const handleSubmitComment = () => {
    const text = draftComment.trim();
    if (!text) return;
    onAddComment?.(text);
    setDraftComment('');
  };

  const handleDelete = () => {
    if (!confirmingDelete) {
      setConfirmingDelete(true);
      setTimeout(() => setConfirmingDelete(false), 4000);
      return;
    }
    onDelete?.();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen pt-12 px-4 sm:px-6 max-w-4xl mx-auto pb-32"
      id="recipe-detail"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#78716c] hover:text-[#D85A30] transition-colors mb-8 cursor-pointer group"
        id="back-button"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Назад</span>
      </button>

      <div className="bg-white rounded-[40px] border border-orange-100/60 overflow-hidden shadow-2xl shadow-orange-900/5" id="recipe-card-full">
        {/* Header Image/Emoji */}
        <div
          className={`relative h-[220px] sm:h-[300px] flex items-center justify-center text-7xl sm:text-9xl bg-gradient-to-br ${recipe.gradient} overflow-hidden`}
          id="recipe-header"
        >
          {recipe.imageUrl ? (
            <img
              src={recipe.imageUrl}
              alt={recipe.title}
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <span aria-hidden="true">{recipe.emoji}</span>
          )}
        </div>

        <div className="p-6 sm:p-8 md:p-12">
          <div className="flex flex-wrap items-start justify-between gap-6 mb-6">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className="inline-block px-3 py-1 bg-orange-100 rounded-full text-[10px] font-bold text-orange-600 uppercase tracking-wider">
                  Рецепт дня
                </div>
                {recipe.tags?.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-3 py-1 bg-slate-50 border border-orange-100 rounded-full text-[10px] font-bold text-[#78716c] uppercase tracking-wider"
                  >
                    {TAG_LABELS[tag] ?? tag}
                  </span>
                ))}
              </div>
              <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a0a00] mb-4 break-words">
                {recipe.title}
              </h2>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6">
                <button
                  onClick={() => onViewUser?.(authorUser)}
                  className="flex items-center gap-3 cursor-pointer group/author"
                  aria-label={`Открыть профиль ${authorUser.name}`}
                >
                  <div className="w-10 h-10 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-lg shadow-sm overflow-hidden">
                    <img src={authorUser.avatar} alt={authorUser.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-left">
                    <div className="text-[11px] text-[#78716c] font-medium">Автор рецепта</div>
                    <div className="text-sm font-semibold text-[#1a0a00] group-hover/author:text-[#D85A30] transition-colors">{authorUser.name}</div>
                  </div>
                </button>

                <div className="h-8 w-px bg-orange-100 hidden md:block" />

                <div className="flex flex-wrap gap-4 sm:gap-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-orange-400" />
                    <span className="text-sm font-medium text-[#78716c]">{recipe.time}</span>
                  </div>
                  <button
                    onClick={onToggleLike}
                    className="flex items-center gap-2 cursor-pointer group/like"
                    aria-label={isLiked ? 'Убрать лайк' : 'Поставить лайк'}
                  >
                    <Heart className={cn('w-5 h-5 transition-colors', isLiked ? 'text-red-500 fill-red-500' : 'text-orange-400 fill-orange-400/10 group-hover/like:text-red-400')} />
                    <span className="text-sm font-medium text-[#78716c]">{displayCount} лайков</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-2 relative flex-wrap">
              <button
                onClick={onToggleLike}
                aria-label={isLiked ? 'Убрать лайк' : 'Поставить лайк'}
                className={cn(
                  'p-3 rounded-2xl transition-colors cursor-pointer border',
                  isLiked ? 'bg-red-50 text-red-500 border-red-100' : 'bg-slate-50 hover:bg-red-50 hover:text-red-500 border-transparent hover:border-red-100',
                )}
              >
                <Heart size={20} className={isLiked ? 'fill-red-500' : ''} />
              </button>
              <button
                onClick={handleShare}
                aria-label="Поделиться рецептом"
                className="p-3 bg-slate-50 rounded-2xl hover:bg-orange-50 hover:text-orange-600 transition-colors cursor-pointer border border-transparent hover:border-orange-100"
              >
                <Share2 size={20} />
              </button>
              <button
                onClick={() => onToggleSave?.(recipe)}
                aria-label={recipeSaved ? 'Удалить из сохранённых' : 'Сохранить рецепт'}
                className={cn(
                  'p-3 rounded-2xl transition-colors cursor-pointer border',
                  recipeSaved ? 'bg-orange-50 text-[#D85A30] border-orange-200' : 'bg-slate-50 hover:bg-orange-50 hover:text-orange-600 border-transparent hover:border-orange-100',
                )}
              >
                <Bookmark size={20} className={recipeSaved ? 'fill-[#D85A30]' : ''} />
              </button>
              {canEdit && (
                <>
                  <button
                    onClick={onEdit}
                    aria-label="Редактировать рецепт"
                    className="p-3 bg-slate-50 rounded-2xl hover:bg-orange-50 hover:text-orange-600 transition-colors cursor-pointer border border-transparent hover:border-orange-100"
                  >
                    <Pencil size={20} />
                  </button>
                  <button
                    onClick={handleDelete}
                    aria-label={confirmingDelete ? 'Подтвердить удаление' : 'Удалить рецепт'}
                    className={cn(
                      'p-3 rounded-2xl transition-colors cursor-pointer border flex items-center gap-2',
                      confirmingDelete
                        ? 'bg-red-100 text-red-600 border-red-200'
                        : 'bg-slate-50 hover:bg-red-50 hover:text-red-500 border-transparent hover:border-red-100',
                    )}
                  >
                    <Trash2 size={20} />
                    {confirmingDelete && <span className="text-xs font-bold">Точно?</span>}
                  </button>
                </>
              )}

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

          {/* Rating */}
          {onSetRating && (
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <span className="text-sm font-bold text-[#1a0a00]">Моя оценка:</span>
              <div
                className="flex items-center gap-1"
                role="radiogroup"
                aria-label="Ваша оценка рецепта"
                onMouseLeave={() => setHoverRating(0)}
              >
                {[1, 2, 3, 4, 5].map((star) => {
                  const filled = (hoverRating || rating) >= star;
                  return (
                    <button
                      key={star}
                      role="radio"
                      aria-checked={rating === star}
                      aria-label={`${star} ${star === 1 ? 'звезда' : star < 5 ? 'звезды' : 'звёзд'}`}
                      onMouseEnter={() => setHoverRating(star)}
                      onClick={() => onSetRating(star)}
                      className="p-1 cursor-pointer transition-transform hover:scale-125"
                    >
                      <Star
                        size={22}
                        className={cn(
                          'transition-colors',
                          filled ? 'text-yellow-400 fill-yellow-400' : 'text-slate-300',
                        )}
                      />
                    </button>
                  );
                })}
              </div>
              {rating > 0 && (
                <span className="text-xs text-[#78716c] font-semibold">
                  {rating} / 5
                </span>
              )}
            </div>
          )}

          {recipe.description && (
            <p className="text-[15px] leading-relaxed text-[#78716c] pb-2">
              {recipe.description}
            </p>
          )}

          <div className="grid md:grid-cols-3 gap-8 md:gap-12 pt-8 border-t border-orange-50">
            <div className="md:col-span-1">
              <h4 className="font-display text-xl font-bold text-[#1a0a00] mb-6 flex items-center gap-2">
                <ChefHat className="w-5 h-5 text-orange-500" />
                Ингредиенты
              </h4>
              <ul className="space-y-3">
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
              <div className="space-y-6 md:space-y-8">
                {(recipe.steps && recipe.steps.length > 0
                  ? recipe.steps
                  : [
                      'Подробное описание того, как именно нужно готовить это потрясающее блюдо. Сначала подготовьте все необходимое, затем приступайте к основному процессу. Не забудьте добавить щепотку любви!',
                      'Продолжайте готовить, аккуратно следуя классическому методу. Прислушивайтесь к ингредиентам — они подскажут, когда всё готово.',
                      'Подайте блюдо горячим, украсив зеленью и любимыми специями. Приятного аппетита!',
                    ]
                ).map((stepText, index) => (
                  <div key={index} className="flex gap-4 sm:gap-6">
                    <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 font-bold flex items-center justify-center shrink-0 border border-orange-100">
                      {index + 1}
                    </div>
                    <div className="min-w-0">
                      <h5 className="font-bold text-[#1a0a00] mb-2">Шаг {index + 1}</h5>
                      <p className="text-sm leading-relaxed text-[#78716c] whitespace-pre-wrap break-words">{stepText}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Comments */}
          {onAddComment && (
            <div className="mt-12 pt-8 border-t border-orange-50">
              <h4 className="font-display text-xl font-bold text-[#1a0a00] mb-6 flex items-center gap-2">
                <MessageCircle className="w-5 h-5 text-orange-500" />
                Комментарии
                <span className="text-sm text-[#78716c] font-medium">({comments.length})</span>
              </h4>

              <div className="space-y-4 mb-6">
                {comments.length === 0 ? (
                  <p className="text-sm text-[#78716c]">Пока нет комментариев. Будьте первым!</p>
                ) : (
                  comments.map((c) => {
                    const isOwn = c.author === currentUserName;
                    return (
                      <div key={c.id} className="flex gap-3">
                        <img
                          src={c.avatarUrl}
                          alt={c.author}
                          className="w-9 h-9 rounded-2xl object-cover bg-orange-50 border border-orange-100 shrink-0"
                        />
                        <div className="flex-1 bg-slate-50 rounded-2xl px-4 py-3 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <div className="flex items-center gap-2 min-w-0">
                              <span className="text-sm font-bold text-[#1a0a00] truncate">{c.author}</span>
                              <span className="text-[10px] text-[#78716c] shrink-0">{formatTimeAgo(c.createdAt)}</span>
                            </div>
                            {isOwn && onRemoveComment && (
                              <button
                                onClick={() => onRemoveComment(c.id)}
                                aria-label="Удалить комментарий"
                                className="text-[#78716c] hover:text-red-500 transition-colors cursor-pointer shrink-0"
                              >
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                          <p className="text-sm text-[#1a0a00] leading-relaxed whitespace-pre-wrap break-words">{c.text}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex items-end gap-3">
                <img
                  src={currentUserAvatar}
                  alt={currentUserName}
                  className="w-9 h-9 rounded-2xl object-cover bg-orange-50 border border-orange-100 shrink-0"
                />
                <div className="flex-1 flex flex-col sm:flex-row gap-2">
                  <textarea
                    value={draftComment}
                    onChange={(e) => setDraftComment(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                        e.preventDefault();
                        handleSubmitComment();
                      }
                    }}
                    placeholder="Поделитесь впечатлением, советом или вопросом…"
                    rows={2}
                    maxLength={500}
                    className="flex-1 bg-slate-50 border border-orange-100 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-200 resize-none"
                  />
                  <button
                    onClick={handleSubmitComment}
                    disabled={!draftComment.trim()}
                    className={cn(
                      'flex items-center justify-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm transition-all sm:self-stretch',
                      draftComment.trim()
                        ? 'bg-[#D85A30] text-white hover:shadow-lg shadow-orange-900/20 cursor-pointer'
                        : 'bg-slate-100 text-[#78716c] cursor-not-allowed',
                    )}
                  >
                    <Send size={16} />
                    Отправить
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function parseLikeCount(raw: string): number {
  if (!raw) return 0;
  const lower = raw.toLowerCase().trim();
  if (lower.endsWith('k')) {
    const num = parseFloat(lower.slice(0, -1));
    return Number.isFinite(num) ? Math.round(num * 1000) : 0;
  }
  const num = parseInt(lower, 10);
  return Number.isFinite(num) ? num : 0;
}

function formatLikeCount(count: number): string {
  if (count >= 1000) return `${(count / 1000).toFixed(1).replace('.0', '')}k`;
  return String(count);
}

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60_000);
  if (minutes < 1) return 'только что';
  if (minutes < 60) return `${minutes} мин назад`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} ч назад`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days} дн назад`;
  return new Date(timestamp).toLocaleDateString('ru-RU');
}
