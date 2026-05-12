import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, X, Bot, ChefHat, RefreshCw, Heart, Clock } from 'lucide-react';
import { GoogleGenAI, Type } from "@google/genai";
import { cn } from '@/src/lib/utils';
import { MOCK_RECIPES } from '../data/recipes';

interface AIAssistantProps {
  onBack: () => void;
  onSelectRecipe: (recipe: any) => void;
}

export default function AIAssistant({ onBack, onSelectRecipe }: AIAssistantProps) {
  const [ingredients, setIngredients] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [communityMatches, setCommunityMatches] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const findRecipes = async () => {
    if (!ingredients.trim()) return;
    
    setIsLoading(true);
    setError(null);
    try {
      // Find matches in community recipes first
      const inputItems = ingredients.toLowerCase().split(',').map(i => i.trim());
      const matches = MOCK_RECIPES.filter(recipe => {
        return inputItems.some(item => 
          recipe.title.toLowerCase().includes(item) || 
          recipe.category.toLowerCase().includes(item)
        );
      });
      setCommunityMatches(matches);

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const prompt = `You are a culinary AI assistant for the RecipeWorld app. 
      The user has the following ingredients in their fridge: "${ingredients}".
      Suggest 3 creative recipes they can make. 
      For each recipe, provide:
      - title: name of the dish
      - emoji: a relevant food emoji
      - author: a fictional "RecipeWorld" community member name
      - likes: a realistic number of likes (e.g. 1.2k)
      - time: cooking time in minutes
      - gradient: a Tailwind CSS gradient string (e.g. "from-orange-100 to-amber-50")
      - brief: 1 sentence summary of the dish.
      
      Return ONLY a JSON array of these 3 objects.`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                emoji: { type: Type.STRING },
                author: { type: Type.STRING },
                likes: { type: Type.STRING },
                time: { type: Type.STRING },
                gradient: { type: Type.STRING },
                brief: { type: Type.STRING },
              },
              required: ["title", "emoji", "author", "likes", "time", "gradient", "brief"]
            }
          }
        }
      });

      const data = JSON.parse(response.text || "[]");
      setSuggestions(data);
    } catch (err) {
      console.error(err);
      setError("Не удалось получить рекомендации. Попробуйте еще раз.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen pt-12 px-6 max-w-4xl mx-auto pb-32"
    >
      <header className="mb-12">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-[#78716c] hover:text-[#D85A30] transition-colors mb-8 cursor-pointer group"
        >
          <X className="w-5 h-5 transition-transform" />
          <span className="font-medium">Закрыть ИИ-помощника</span>
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-[#D85A30]">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-display text-4xl font-bold text-[#1a0a00]">ИИ-Шеф RecipeWorld</h1>
            <p className="text-[#78716c]">Что сегодня в вашем холодильнике?</p>
          </div>
        </div>

        <div className="bg-white border border-orange-100 rounded-[32px] p-8 shadow-sm">
          <div className="space-y-4">
            <label className="text-sm font-bold text-[#1a0a00] flex items-center gap-2">
              <ChefHat className="w-4 h-4 text-orange-500" />
              Введите ингредиенты (через запятую)
            </label>
            <div className="flex gap-3">
              <input 
                type="text" 
                value={ingredients}
                onChange={(e) => setIngredients(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && findRecipes()}
                placeholder="Напр: томаты, сыр, курица..."
                className="flex-1 bg-slate-50 border border-orange-50 rounded-2xl px-6 py-4 focus:outline-none focus:ring-2 focus:ring-orange-200 transition-all font-sans"
              />
              <button 
                onClick={findRecipes}
                disabled={isLoading || !ingredients.trim()}
                className="bg-[#D85A30] text-white p-4 rounded-2xl shadow-lg shadow-orange-700/10 hover:bg-[#c44e27] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {isLoading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-12">
        {/* Community Matches Section */}
        {communityMatches.length > 0 && !isLoading && (
          <section className="space-y-6">
            <h2 className="font-display text-xl font-bold text-[#1a0a00] px-2 flex items-center gap-2">
              <RefreshCw className="w-5 h-5 text-orange-500" />
              Найдено в RecipeWorld
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {communityMatches.map(recipe => (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  key={recipe.id}
                  onClick={() => onSelectRecipe({ ...recipe, gradient: 'from-orange-50 to-amber-50' })}
                  className="bg-white p-4 rounded-[24px] border border-orange-100 flex gap-4 hover:shadow-lg transition-all cursor-pointer group"
                >
                  <div className="w-16 h-16 bg-slate-50 rounded-xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                    {recipe.emoji}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#1a0a00] text-sm mb-2">{recipe.title}</h3>
                    <div className="flex items-center gap-3 text-[10px] text-[#78716c]">
                      <span className="flex items-center gap-1 font-bold">❤️ {recipe.likes}</span>
                      <span className="flex items-center gap-1 font-bold">⏱ {recipe.time}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* AI Suggestions Section */}
        <section className="space-y-6">
          <h2 className="font-display text-xl font-bold text-[#1a0a00] px-2 flex items-center gap-2">
             <Bot className="w-5 h-5 text-orange-500" />
             Новые идеи от ИИ
          </h2>

          {isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 opacity-50 pointer-events-none">
              {[1, 2].map(i => (
                <div key={i} className="bg-white rounded-[32px] border border-orange-100/60 p-6 animate-pulse h-48" />
              ))}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-6 py-4 rounded-2xl text-sm font-medium">
              {error}
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {suggestions.length > 0 && !isLoading && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {suggestions.map((recipe, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => onSelectRecipe({ ...recipe, id: `ai-${idx}` })}
                    className="group bg-white rounded-[32px] border border-orange-100/60 p-6 shadow-sm hover:shadow-xl hover:shadow-orange-900/5 transition-all cursor-pointer"
                  >
                    <div className="flex gap-6">
                      <div className={cn("w-20 h-20 rounded-2xl shrink-0 flex items-center justify-center text-4xl bg-gradient-to-br", recipe.gradient)}>
                        {recipe.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center text-[8px] text-orange-600 font-bold">W</div>
                          <span className="text-[11px] text-[#78716c] font-medium">by {recipe.author}</span>
                        </div>
                        <h3 className="font-display font-bold text-[#1a0a00] mb-2 group-hover:text-[#D85A30] transition-colors">{recipe.title}</h3>
                        <p className="text-[12px] text-[#78716c] line-clamp-2 leading-relaxed mb-4">{recipe.brief}</p>
                        <div className="flex gap-4">
                          <span className="text-[11px] text-[#78716c] flex items-center gap-1 font-semibold">❤️ {recipe.likes}</span>
                          <span className="text-[11px] text-[#78716c] flex items-center gap-1 font-semibold">⏱ {recipe.time} мин</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </AnimatePresence>

          {!isLoading && suggestions.length === 0 && !error && (
            <div className="text-center py-20 bg-white/50 rounded-[40px] border border-dashed border-orange-100">
              <div className="text-5xl mb-4 opacity-50">🥗</div>
              <h3 className="text-lg font-bold text-[#1a0a00]">Ваш персональный шеф ждет</h3>
              <p className="text-[#78716c] text-sm">Введите список продуктов, и я придумаю что-то вкусное!</p>
            </div>
          )}
        </section>
      </div>
    </motion.div>
  );
}
