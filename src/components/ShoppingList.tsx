import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingCart, Plus, Check, Trash2, Copy, X } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import type { ShoppingItem } from '../lib/shopping';

interface ShoppingListProps {
  items: ShoppingItem[];
  onBack: () => void;
  onToggle: (key: string) => void;
  onAddExtra: (text: string) => void;
  onRemoveExtra: (key: string) => void;
  onClearChecked: () => void;
  onClearAll: () => void;
}

export default function ShoppingList({
  items,
  onBack,
  onToggle,
  onAddExtra,
  onRemoveExtra,
  onClearChecked,
  onClearAll,
}: ShoppingListProps) {
  const [draft, setDraft] = useState('');
  const [copyToast, setCopyToast] = useState(false);

  const total = items.length;
  const checked = items.filter((i) => i.checked).length;
  const remaining = total - checked;

  // Group by recipe so the list stays scannable when it's long. Manually-added
  // "extras" go into their own bucket at the bottom.
  const grouped = useMemo(() => {
    const byKey = new Map<string, { title: string; items: ShoppingItem[] }>();
    for (const item of items) {
      const key = item.recipeId ?? '__extras__';
      const title = item.recipeId ? item.recipeTitle ?? 'Без названия' : 'Дополнительно';
      if (!byKey.has(key)) byKey.set(key, { title, items: [] });
      byKey.get(key)!.items.push(item);
    }
    return Array.from(byKey.entries()).map(([key, value]) => ({ groupKey: key, ...value }));
  }, [items]);

  const handleAdd = () => {
    const text = draft.trim();
    if (!text) return;
    onAddExtra(text);
    setDraft('');
  };

  const handleCopyAll = async () => {
    const text = items
      .filter((i) => !i.checked)
      .map((i) => `• ${i.text}`)
      .join('\n');
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopyToast(true);
      setTimeout(() => setCopyToast(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen pt-12 px-4 sm:px-6 max-w-3xl mx-auto pb-32"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#78716c] hover:text-[#D85A30] transition-colors mb-8 cursor-pointer group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Назад</span>
      </button>

      <div className="bg-white rounded-[40px] border border-orange-100/60 shadow-2xl shadow-orange-900/5 overflow-hidden">
        <header className="px-6 sm:px-8 pt-8 pb-6 border-b border-orange-50">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-bold text-[#1a0a00] flex items-center gap-3">
                <ShoppingCart className="w-7 h-7 text-orange-500" />
                Список покупок
              </h1>
              <p className="text-sm text-[#78716c] mt-1">
                Ингредиенты из ваших сохранённых рецептов.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 relative">
              <button
                onClick={handleCopyAll}
                disabled={remaining === 0}
                aria-label="Скопировать список"
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs transition-all',
                  remaining === 0
                    ? 'bg-slate-50 text-[#78716c] cursor-not-allowed'
                    : 'bg-slate-50 text-[#1a0a00] hover:bg-orange-50 cursor-pointer',
                )}
              >
                <Copy size={14} /> Копировать
              </button>
              {checked > 0 && (
                <button
                  onClick={onClearChecked}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-xs bg-slate-50 text-[#78716c] hover:bg-orange-50 transition-all cursor-pointer"
                >
                  <Check size={14} /> Сбросить отмеченные
                </button>
              )}
              {copyToast && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="absolute -bottom-10 right-0 bg-[#1a0a00] text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2 whitespace-nowrap"
                >
                  <Check size={14} /> Скопировано
                </motion.div>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-4 mt-6 text-xs">
            <span className="px-3 py-1.5 bg-orange-50 text-[#D85A30] rounded-full font-bold uppercase tracking-wider">
              {total} всего
            </span>
            {checked > 0 && (
              <span className="px-3 py-1.5 bg-green-50 text-green-600 rounded-full font-bold uppercase tracking-wider">
                {checked} куплено
              </span>
            )}
            {remaining > 0 && (
              <span className="px-3 py-1.5 bg-slate-50 text-[#78716c] rounded-full font-bold uppercase tracking-wider">
                {remaining} осталось
              </span>
            )}
          </div>
        </header>

        {/* Add own item */}
        <div className="px-6 sm:px-8 py-5 border-b border-orange-50 flex gap-2">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleAdd();
              }
            }}
            placeholder="Добавить свой ингредиент…"
            maxLength={120}
            className="flex-1 bg-slate-50 border border-orange-100 rounded-2xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-orange-200"
          />
          <button
            onClick={handleAdd}
            disabled={!draft.trim()}
            aria-label="Добавить"
            className={cn(
              'flex items-center gap-2 px-4 rounded-2xl font-bold text-sm transition-all',
              draft.trim()
                ? 'bg-[#D85A30] text-white hover:shadow-lg shadow-orange-900/20 cursor-pointer'
                : 'bg-slate-100 text-[#78716c] cursor-not-allowed',
            )}
          >
            <Plus size={16} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20 px-6">
            <div className="text-6xl mb-4" aria-hidden="true">🛒</div>
            <h3 className="text-xl font-bold text-[#1a0a00] mb-2">Список пуст</h3>
            <p className="text-[#78716c]">
              Сохраните пару рецептов — и их ингредиенты автоматически попадут сюда.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-orange-50">
            {grouped.map((group) => (
              <div key={group.groupKey} className="px-6 sm:px-8 py-5">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-orange-600 mb-3">
                  {group.title}
                </h3>
                <ul className="space-y-1">
                  {group.items.map((item) => (
                    <li key={item.key} className="flex items-center gap-3 group">
                      <button
                        onClick={() => onToggle(item.key)}
                        aria-label={item.checked ? 'Снять отметку' : 'Отметить как купленное'}
                        aria-pressed={item.checked}
                        className={cn(
                          'w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all cursor-pointer shrink-0',
                          item.checked
                            ? 'bg-[#D85A30] border-[#D85A30] text-white'
                            : 'border-orange-200 hover:border-orange-400 bg-white',
                        )}
                      >
                        {item.checked && <Check size={14} strokeWidth={3} />}
                      </button>
                      <span
                        className={cn(
                          'flex-1 text-sm leading-relaxed transition-colors min-w-0 break-words',
                          item.checked ? 'line-through text-[#78716c]' : 'text-[#1a0a00]',
                        )}
                      >
                        {item.text}
                      </span>
                      {!item.recipeId && (
                        <button
                          onClick={() => onRemoveExtra(item.key)}
                          aria-label="Удалить"
                          className="text-[#78716c] hover:text-red-500 transition-colors cursor-pointer opacity-0 group-hover:opacity-100 shrink-0"
                        >
                          <X size={16} />
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="px-6 sm:px-8 py-5">
              <button
                onClick={onClearAll}
                className="flex items-center gap-2 text-xs font-bold text-red-500 hover:text-red-600 transition-colors cursor-pointer"
              >
                <Trash2 size={14} /> Очистить весь список
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
