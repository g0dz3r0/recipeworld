import { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Search, UserPlus, UserCheck } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import type { MockUser } from '../data/recipes';

interface FollowListProps {
  title: string;
  subtitle?: string;
  users: MockUser[];
  selfId?: string;
  followingIds?: string[];
  onBack: () => void;
  onSelectUser?: (user: MockUser) => void;
  onToggleFollow?: (userId: string) => void;
}

export default function FollowList({
  title,
  subtitle,
  users,
  selfId,
  followingIds = [],
  onBack,
  onSelectUser,
  onToggleFollow,
}: FollowListProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(u => u.name.toLowerCase().includes(q) || u.role.toLowerCase().includes(q));
  }, [users, query]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen pt-8 sm:pt-12 px-4 sm:px-6 max-w-3xl mx-auto pb-32"
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
          <h1 className="font-display text-3xl font-bold text-[#1a0a00]">{title}</h1>
          {subtitle && <p className="text-sm text-[#78716c] mt-1">{subtitle}</p>}
          <div className="relative mt-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#78716c] w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Поиск по имени или роли…"
              className="w-full bg-slate-50 border border-orange-100 rounded-2xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all"
            />
          </div>
          <p className="text-[11px] text-[#78716c] mt-3 uppercase tracking-wider font-bold">
            {filtered.length} {pluralize(filtered.length, 'результат', 'результата', 'результатов')}
          </p>
        </header>

        {filtered.length === 0 ? (
          <div className="text-center py-20 px-6">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-[#1a0a00] mb-2">Ничего не найдено</h3>
            <p className="text-[#78716c]">{users.length === 0 ? 'Список пуст.' : 'Попробуйте изменить запрос.'}</p>
          </div>
        ) : (
          <div className="divide-y divide-orange-50">
            {filtered.map(user => {
              const isSelf = !!selfId && user.id === selfId;
              const isCurrentlyFollowing = followingIds.includes(user.id);
              return (
                <div
                  key={user.id}
                  className={cn(
                    'flex items-center gap-4 px-6 py-4 transition-colors',
                    isSelf ? 'bg-orange-50/40' : 'hover:bg-orange-50/60 cursor-pointer',
                  )}
                  onClick={() => !isSelf && onSelectUser?.(user)}
                >
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-400 to-amber-300 p-0.5 shrink-0">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-full h-full rounded-[14px] object-cover bg-white"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-sm text-[#1a0a00] truncate">{user.name}</h3>
                      {isSelf && (
                        <span className="px-2 py-0.5 bg-orange-100 text-[#D85A30] rounded-full text-[10px] font-bold uppercase tracking-wider">Это вы</span>
                      )}
                    </div>
                    <p className="text-[11px] text-[#D85A30] font-semibold">{user.role}</p>
                  </div>
                  {!isSelf && onToggleFollow && (
                    <button
                      onClick={(e) => { e.stopPropagation(); onToggleFollow(user.id); }}
                      className={cn(
                        'flex items-center gap-1.5 px-4 py-2 rounded-2xl font-bold text-xs transition-all cursor-pointer shrink-0',
                        isCurrentlyFollowing
                          ? 'bg-slate-50 text-[#78716c] border border-orange-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100'
                          : 'bg-[#D85A30] text-white hover:shadow-lg shadow-orange-900/20',
                      )}
                    >
                      {isCurrentlyFollowing ? <UserCheck size={14} /> : <UserPlus size={14} />}
                      {isCurrentlyFollowing ? 'Подписан' : 'Подписаться'}
                    </button>
                  )}
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
