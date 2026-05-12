import { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Heart, Clock, Users, BookOpen, UserPlus, UserCheck } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { MockUser, MOCK_RECIPES } from '../data/recipes';

interface UserProfileProps {
  user: MockUser;
  onBack: () => void;
  onSelectRecipe?: (recipe: any) => void;
}

export default function UserProfile({ user, onBack, onSelectRecipe }: UserProfileProps) {
  const [isFollowing, setIsFollowing] = useState(false);

  const userRecipes = MOCK_RECIPES.filter(r => user.recipes.includes(r.id));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen pt-12 px-6 max-w-4xl mx-auto pb-32"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-[#78716c] hover:text-[#D85A30] transition-colors mb-8 cursor-pointer group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Назад</span>
      </button>

      <div className="bg-white rounded-[40px] border border-orange-100/60 overflow-hidden shadow-2xl shadow-orange-900/5">
        {/* Cover */}
        <div className="h-32 bg-gradient-to-br from-orange-100 via-amber-50 to-orange-200 relative">
          <div className="absolute inset-0 opacity-10">
            <span className="absolute top-4 left-[20%] text-4xl">🍳</span>
            <span className="absolute top-6 right-[25%] text-3xl">🥘</span>
            <span className="absolute bottom-2 left-[60%] text-4xl">🍜</span>
          </div>
        </div>

        <div className="px-8 md:px-12 pb-10">
          {/* Avatar + Info */}
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-12 mb-8 relative z-10">
            <div className="w-32 h-32 rounded-[40px] bg-gradient-to-tr from-orange-400 to-amber-300 p-1 shadow-xl shrink-0">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-full h-full object-cover rounded-[38px] bg-white"
              />
            </div>
            <div className="flex-1 text-center md:text-left pb-2">
              <h1 className="text-3xl font-bold text-[#1a0a00] mb-1">{user.name}</h1>
              <p className="text-sm text-[#D85A30] font-semibold mb-2">{user.role}</p>
              {user.bio && <p className="text-sm text-[#78716c] max-w-md">{user.bio}</p>}
            </div>
            <button
              onClick={() => setIsFollowing(!isFollowing)}
              className={cn(
                "flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all cursor-pointer shrink-0",
                isFollowing
                  ? "bg-slate-50 text-[#78716c] border border-orange-100 hover:bg-red-50 hover:text-red-500 hover:border-red-100"
                  : "bg-[#D85A30] text-white hover:shadow-lg shadow-orange-900/20"
              )}
            >
              {isFollowing ? <UserCheck size={18} /> : <UserPlus size={18} />}
              {isFollowing ? 'Подписан' : 'Подписаться'}
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 mb-10 justify-center md:justify-start">
            <div className="flex items-center gap-2">
              <Users size={18} className="text-orange-400" />
              <span className="text-sm font-bold text-[#1a0a00]">{user.followers}</span>
              <span className="text-xs text-[#78716c]">подписчиков</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen size={18} className="text-orange-400" />
              <span className="text-sm font-bold text-[#1a0a00]">{user.recipesCount}</span>
              <span className="text-xs text-[#78716c]">рецептов</span>
            </div>
          </div>

          {/* Recipes */}
          <div>
            <h3 className="text-xl font-bold text-[#1a0a00] mb-6">Рецепты автора</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {userRecipes.map(recipe => (
                <div
                  key={recipe.id}
                  onClick={() => onSelectRecipe?.({ ...recipe, gradient: 'from-orange-100 to-amber-50' })}
                  className="group bg-slate-50 rounded-3xl p-4 flex gap-4 hover:bg-orange-50 transition-colors cursor-pointer"
                >
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-sm">
                    {recipe.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-[#1a0a00] mb-2 truncate">{recipe.title}</h4>
                    <div className="flex items-center gap-3 text-[10px] text-[#78716c]">
                      <span className="flex items-center gap-1 font-bold"><Heart size={10} /> {recipe.likes}</span>
                      <span className="flex items-center gap-1 font-bold"><Clock size={10} /> {recipe.time}</span>
                    </div>
                  </div>
                </div>
              ))}
              {/* Show more placeholder recipes */}
              {Array.from({ length: Math.min(3, user.recipesCount - userRecipes.length) }).map((_, i) => (
                <div key={`placeholder-${i}`} className="bg-slate-50 rounded-3xl p-4 flex gap-4 opacity-60">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-sm">
                    🍽️
                  </div>
                  <div className="flex-1">
                    <div className="h-4 w-3/4 bg-slate-200 rounded-full mb-3" />
                    <div className="h-3 w-1/2 bg-slate-100 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
            {user.recipesCount > userRecipes.length && (
              <p className="text-center text-sm text-[#78716c] mt-6">
                ...и ещё {user.recipesCount - userRecipes.length} рецептов
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
