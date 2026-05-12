import { motion } from 'motion/react';
import { ArrowLeft, Clock, Heart } from 'lucide-react';

interface CategoryViewProps {
  cuisine: {
    name: string;
    emoji: string;
    from: string;
    to: string;
  };
  onBack: () => void;
  onSelectRecipe?: (recipe: any) => void;
}

export default function CategoryView({ cuisine, onBack, onSelectRecipe }: CategoryViewProps) {
  const recipes = [
    { id: 1, title: `Фирменное блюдо ${cuisine.name}`, emoji: cuisine.emoji, author: "Анна С.", likes: "1.2k", time: "45 мин", gradient: `from-[${cuisine.from}] to-[${cuisine.to}]` },
    { id: 2, title: `Домашний рецепт`, emoji: cuisine.emoji, author: "Иван К.", likes: "850", time: "30 мин", gradient: 'from-orange-50 to-amber-50' },
    { id: 3, title: `Секрет шеф-повара`, emoji: cuisine.emoji, author: "Елена П.", likes: "2.1k", time: "60 мин", gradient: 'from-orange-100 to-amber-50' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="min-h-screen pt-12 px-6 max-w-7xl mx-auto pb-32"
      id="category-view"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-[#78716c] hover:text-[#D85A30] transition-colors mb-8 cursor-pointer group"
        id="back-button"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Вернуться назад</span>
      </button>

      <div className="flex items-center gap-4 mb-12" id="category-header">
        <div 
          className="w-16 h-16 rounded-3xl flex items-center justify-center text-4xl shadow-lg border border-white/50"
          style={{ background: `linear-gradient(135deg, ${cuisine.from}, ${cuisine.to})` }}
        >
          {cuisine.emoji}
        </div>
        <div>
          <h2 className="font-display text-4xl font-bold text-[#1a0a00]">{cuisine.name} кухня</h2>
          <p className="text-[#78716c]">Откройте лучшие рецепты этого региона</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="recipes-grid">
        {recipes.map((recipe) => (
          <motion.div
            key={recipe.id}
            whileHover={{ y: -5 }}
            onClick={() => onSelectRecipe?.(recipe)}
            className="bg-white rounded-[32px] border border-orange-100/60 p-6 shadow-sm hover:shadow-xl hover:shadow-orange-900/5 transition-all text-left cursor-pointer"
          >
            <div className="h-40 bg-orange-50 rounded-2xl mb-4 flex items-center justify-center text-5xl">
              {cuisine.emoji}
            </div>
            <h3 className="font-display font-semibold text-lg text-[#1a0a00] mb-2">{recipe.title}</h3>
            <p className="text-sm text-[#78716c] mb-4">Автор: {recipe.author}</p>
            <div className="flex items-center justify-between pt-4 border-t border-orange-50">
              <div className="flex items-center gap-4 text-[#78716c] text-sm">
                <span className="flex items-center gap-1"><Heart size={16} className="text-orange-400" /> {recipe.likes}</span>
                <span className="flex items-center gap-1"><Clock size={16} /> {recipe.time}</span>
              </div>
              <button className="text-[#D85A30] font-semibold text-sm hover:underline">Открыть</button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
