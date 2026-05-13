import { useRef, useState, type ChangeEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ChefHat, Check, ImagePlus, X, Plus } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { CATEGORIES } from '../data/recipes';
import { ImageProcessingError, processRecipeImage } from '@/src/lib/image';

export interface UserRecipeDraft {
  id: string;
  title: string;
  emoji: string;
  author: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  time: string;
  timeRange: '<15' | '15-30' | '>30';
  likes: string;
  gradient: string;
  imageUrl?: string;
  description?: string;
  ingredients?: string[];
  steps?: string[];
  createdAt: number;
}

interface RecipeCreatorProps {
  onBack: () => void;
  onCreate: (recipe: UserRecipeDraft) => void;
  defaultAuthor?: string;
}

// Fallback emoji per category — used only when something tries to render the
// recipe without an image (shouldn't happen now that photos are required, but
// the Recipe type still expects a non-empty emoji string).
const CATEGORY_EMOJI: Record<string, string> = {
  pasta: '🍝',
  pizza: '🍕',
  seafood: '🦐',
  desserts: '🧁',
  salads: '🥗',
};

const DIFFICULTY_OPTIONS: { id: 'easy' | 'medium' | 'hard'; label: string }[] = [
  { id: 'easy', label: 'Легко' },
  { id: 'medium', label: 'Средне' },
  { id: 'hard', label: 'Сложно' },
];

const TIME_RANGE_OPTIONS: { id: '<15' | '15-30' | '>30'; label: string }[] = [
  { id: '<15', label: '< 15 мин' },
  { id: '15-30', label: '15-30 мин' },
  { id: '>30', label: '> 30 мин' },
];

const GRADIENTS_BY_CATEGORY: Record<string, string> = {
  pasta: 'from-orange-100 to-amber-50',
  pizza: 'from-red-50 to-orange-100',
  seafood: 'from-cyan-50 to-blue-50',
  desserts: 'from-pink-50 to-rose-100',
  salads: 'from-green-50 to-emerald-100',
};

const SELECTABLE_CATEGORIES = CATEGORIES.filter(c => c.id !== 'all');

export default function RecipeCreator({ onBack, onCreate, defaultAuthor = 'Вы' }: RecipeCreatorProps) {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<string>(SELECTABLE_CATEGORIES[0]?.id ?? 'pasta');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [timeRange, setTimeRange] = useState<'<15' | '15-30' | '>30'>('15-30');
  const [timeText, setTimeText] = useState('25 мин');
  const [author, setAuthor] = useState(defaultAuthor);
  const [description, setDescription] = useState('');
  const [ingredients, setIngredients] = useState<string[]>(['', '']);
  const [steps, setSteps] = useState<string[]>(['']);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageMeta, setImageMeta] = useState<{ width: number; height: number; approxKB: number } | null>(null);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const updateIngredient = (index: number, value: string) => {
    setIngredients(prev => prev.map((v, i) => (i === index ? value : v)));
  };
  const addIngredient = () => setIngredients(prev => [...prev, '']);
  const removeIngredient = (index: number) => {
    setIngredients(prev => (prev.length <= 1 ? [''] : prev.filter((_, i) => i !== index)));
  };

  const updateStep = (index: number, value: string) => {
    setSteps(prev => prev.map((v, i) => (i === index ? value : v)));
  };
  const addStep = () => setSteps(prev => [...prev, '']);
  const removeStep = (index: number) => {
    setSteps(prev => (prev.length <= 1 ? [''] : prev.filter((_, i) => i !== index)));
  };

  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    // Reset the input so picking the same file twice re-fires onChange.
    event.target.value = '';
    if (!file) return;

    setError(null);
    setIsProcessingImage(true);
    try {
      const processed = await processRecipeImage(file);
      setImageUrl(processed.dataUrl);
      setImageMeta({ width: processed.width, height: processed.height, approxKB: processed.approxKB });
    } catch (err) {
      const message = err instanceof ImageProcessingError ? err.message : 'Не удалось обработать фото.';
      setError(message);
    } finally {
      setIsProcessingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setImageUrl(null);
    setImageMeta(null);
  };

  const handleSubmit = () => {
    const trimmedTitle = title.trim();
    if (!trimmedTitle) {
      setError('Введите название рецепта');
      return;
    }
    if (!imageUrl) {
      setError('Загрузите фото блюда');
      return;
    }

    const cleanIngredients = ingredients.map(s => s.trim()).filter(Boolean);
    const cleanSteps = steps.map(s => s.trim()).filter(Boolean);

    if (cleanIngredients.length === 0) {
      setError('Добавьте хотя бы один ингредиент');
      return;
    }
    if (cleanSteps.length === 0) {
      setError('Опишите хотя бы один шаг приготовления');
      return;
    }

    const trimmedAuthor = author.trim() || 'Вы';

    const recipe: UserRecipeDraft = {
      id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      title: trimmedTitle,
      emoji: CATEGORY_EMOJI[category] ?? '🍽️',
      author: trimmedAuthor,
      category,
      difficulty,
      time: timeText.trim() || '25 мин',
      timeRange,
      likes: '0',
      gradient: GRADIENTS_BY_CATEGORY[category] ?? 'from-orange-50 to-amber-50',
      imageUrl: imageUrl ?? undefined,
      description: description.trim() || undefined,
      ingredients: cleanIngredients,
      steps: cleanSteps,
      createdAt: Date.now(),
    };
    try {
      onCreate(recipe);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Не удалось сохранить рецепт.';
      setError(message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen pt-12 px-6 max-w-3xl mx-auto pb-32"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#78716c] hover:text-[#D85A30] transition-colors mb-8 cursor-pointer group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Назад</span>
      </button>

      <div className="bg-white rounded-[40px] border border-orange-100/60 overflow-hidden shadow-2xl shadow-orange-900/5">
        <div className={cn(
          'h-[260px] relative flex items-center justify-center bg-gradient-to-br',
          gradientForCategory(category),
        )}>
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt="Превью рецепта"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <button
                onClick={handleRemoveImage}
                className="absolute top-4 right-4 bg-white/95 backdrop-blur text-[#1a0a00] p-2.5 rounded-full shadow-lg hover:bg-white transition-colors cursor-pointer"
                aria-label="Удалить фото"
              >
                <X size={18} />
              </button>
              {imageMeta && (
                <div className="absolute bottom-4 left-4 bg-black/55 backdrop-blur text-white text-[11px] font-semibold px-3 py-1.5 rounded-full">
                  {imageMeta.width}×{imageMeta.height} · ~{imageMeta.approxKB} КБ
                </div>
              )}
            </>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center gap-3 text-[#78716c] hover:text-[#D85A30] transition-colors cursor-pointer"
            >
              <div className="w-20 h-20 rounded-full bg-white/80 backdrop-blur border border-orange-100 flex items-center justify-center shadow-sm">
                <ImagePlus size={32} />
              </div>
              <span className="text-sm font-semibold">Добавить фото блюда</span>
              <span className="text-[11px] text-[#78716c]">JPG · PNG · WEBP</span>
            </button>
          )}
        </div>

        <div className="p-8 md:p-12 space-y-8">
          <div>
            <div className="inline-block px-3 py-1 bg-orange-100 rounded-full text-[10px] font-bold text-orange-600 mb-4 uppercase tracking-wider flex items-center gap-1 w-fit">
              <ChefHat className="w-3 h-3" />
              Новый рецепт
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-[#1a0a00]">Создать рецепт</h2>
            <p className="text-sm text-[#78716c] mt-2">Расскажите миру о вашем любимом блюде.</p>
          </div>

          {/* Photo */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-[#1a0a00]">Фото блюда</label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isProcessingImage}
                className={cn(
                  'flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all border cursor-pointer',
                  isProcessingImage
                    ? 'bg-slate-50 text-[#78716c] border-orange-100 cursor-wait'
                    : 'bg-orange-50 text-[#D85A30] border-orange-200 hover:bg-orange-100',
                )}
              >
                <ImagePlus size={18} />
                {isProcessingImage ? 'Обработка…' : imageUrl ? 'Заменить фото' : 'Загрузить фото'}
              </button>
              {imageUrl && (
                <button
                  onClick={handleRemoveImage}
                  className="flex items-center gap-2 px-4 py-3 rounded-2xl font-semibold text-sm text-[#78716c] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer border border-transparent hover:border-red-100"
                >
                  <X size={16} />
                  Убрать
                </button>
              )}
              <p className="text-[11px] text-[#78716c] flex-1 min-w-[200px]">
                JPG / PNG / WEBP, до 15 МБ. Фото автоматически сжимается до 1200 px по длинной стороне.
              </p>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1a0a00]">Название</label>
            <input
              type="text"
              value={title}
              onChange={(e) => { setTitle(e.target.value); setError(null); }}
              placeholder="Например: Карбонара по-домашнему"
              maxLength={80}
              className="w-full bg-slate-50 border border-orange-50 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>

          {/* Category */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-[#1a0a00]">Категория</label>
            <div className="flex flex-wrap gap-2">
              {SELECTABLE_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    'px-4 py-2.5 rounded-2xl text-sm font-semibold flex items-center gap-2 border transition-all',
                    category === cat.id
                      ? 'bg-[#D85A30] text-white border-[#D85A30] shadow-orange-200 shadow-md'
                      : 'bg-white text-[#78716c] border-orange-100 hover:border-orange-300',
                  )}
                >
                  <span>{cat.emoji}</span>
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty */}
          <div className="space-y-3">
            <label className="text-sm font-bold text-[#1a0a00]">Сложность</label>
            <div className="flex gap-2">
              {DIFFICULTY_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setDifficulty(opt.id)}
                  className={cn(
                    'px-4 py-2.5 rounded-2xl text-sm font-semibold border transition-all',
                    difficulty === opt.id
                      ? 'bg-orange-100 border-orange-300 text-[#D85A30]'
                      : 'bg-slate-50 border-transparent text-[#78716c] hover:bg-orange-50',
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-sm font-bold text-[#1a0a00]">Время готовки</label>
              <div className="flex flex-wrap gap-2">
                {TIME_RANGE_OPTIONS.map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => setTimeRange(opt.id)}
                    className={cn(
                      'px-4 py-2.5 rounded-2xl text-sm font-semibold border transition-all',
                      timeRange === opt.id
                        ? 'bg-orange-100 border-orange-300 text-[#D85A30]'
                        : 'bg-slate-50 border-transparent text-[#78716c] hover:bg-orange-50',
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-[#1a0a00]">Точное время</label>
              <input
                type="text"
                value={timeText}
                onChange={(e) => setTimeText(e.target.value)}
                placeholder="например: 25 мин"
                maxLength={20}
                className="w-full bg-slate-50 border border-orange-50 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-orange-200"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1a0a00]">Краткое описание</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Пару слов о блюде — откуда оно, чем особенно вкусно, для какого случая…"
              rows={3}
              maxLength={300}
              className="w-full bg-slate-50 border border-orange-50 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-orange-200 resize-none"
            />
            <p className="text-[11px] text-[#78716c] text-right">{description.length}/300</p>
          </div>

          {/* Ingredients */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-bold text-[#1a0a00]">Ингредиенты</label>
              <span className="text-[11px] text-[#78716c]">{ingredients.filter(s => s.trim()).length} шт</span>
            </div>
            <div className="space-y-2">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-orange-50 text-orange-500 text-[11px] font-bold flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder={index === 0 ? 'Например: 200 г спагетти' : index === 1 ? 'Например: 3 яичных желтка' : 'Ещё один ингредиент…'}
                    maxLength={120}
                    className="flex-1 bg-slate-50 border border-orange-50 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
                  />
                  <button
                    onClick={() => removeIngredient(index)}
                    aria-label="Удалить ингредиент"
                    className="p-2 rounded-xl text-[#78716c] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addIngredient}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm text-[#D85A30] bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer border border-orange-100"
            >
              <Plus size={16} />
              Добавить ингредиент
            </button>
          </div>

          {/* Steps */}
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <label className="text-sm font-bold text-[#1a0a00]">Способ приготовления</label>
              <span className="text-[11px] text-[#78716c]">{steps.filter(s => s.trim()).length} шаг(ов)</span>
            </div>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div key={index} className="flex gap-3 items-start">
                  <div className="w-8 h-8 rounded-full bg-orange-50 text-[#D85A30] font-bold text-sm flex items-center justify-center shrink-0 border border-orange-100">
                    {index + 1}
                  </div>
                  <textarea
                    value={step}
                    onChange={(e) => updateStep(index, e.target.value)}
                    placeholder={index === 0 ? 'Подготовьте ингредиенты, поставьте воду на огонь…' : 'Опишите следующий шаг…'}
                    rows={Math.max(2, Math.ceil(step.length / 80))}
                    maxLength={500}
                    className="flex-1 bg-slate-50 border border-orange-50 rounded-xl px-4 py-3 text-sm leading-relaxed outline-none focus:ring-2 focus:ring-orange-200 resize-none"
                  />
                  <button
                    onClick={() => removeStep(index)}
                    aria-label="Удалить шаг"
                    className="p-2 mt-1 rounded-xl text-[#78716c] hover:text-red-500 hover:bg-red-50 transition-colors cursor-pointer shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
            <button
              onClick={addStep}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-semibold text-sm text-[#D85A30] bg-orange-50 hover:bg-orange-100 transition-colors cursor-pointer border border-orange-100"
            >
              <Plus size={16} />
              Добавить шаг
            </button>
          </div>

          {/* Author */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-[#1a0a00]">Автор</label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              maxLength={40}
              className="w-full bg-slate-50 border border-orange-50 rounded-2xl p-4 text-sm outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>

          {error && (
            <div className="text-sm font-semibold text-red-500 bg-red-50 border border-red-100 rounded-2xl px-4 py-3">
              {error}
            </div>
          )}

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              onClick={handleSubmit}
              className="bg-[#D85A30] text-white px-6 py-3.5 rounded-2xl font-bold text-sm hover:shadow-lg shadow-orange-900/20 transition-all cursor-pointer flex items-center gap-2"
            >
              <Check size={18} />
              Опубликовать рецепт
            </button>
            <button
              onClick={onBack}
              className="bg-slate-50 text-[#78716c] px-6 py-3.5 rounded-2xl font-bold text-sm hover:bg-orange-50 transition-all cursor-pointer border border-transparent hover:border-orange-100"
            >
              Отмена
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function gradientForCategory(category: string): string {
  return GRADIENTS_BY_CATEGORY[category] ?? 'from-orange-50 to-amber-50';
}
