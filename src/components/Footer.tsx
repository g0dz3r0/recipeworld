import { Instagram, Twitter, Facebook, Mail } from 'lucide-react';

interface FooterProps {
  onOpenRecipes: () => void;
  onOpenAIAssistant: () => void;
}

export default function Footer({ onOpenRecipes, onOpenAIAssistant }: FooterProps) {
  return (
    <footer className="bg-white border-t border-orange-100/60 pt-20 pb-40 px-6" id="about-section">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-orange-50 border border-orange-100 rounded-2xl flex items-center justify-center text-xl shadow-sm">
                🍳
              </div>
              <span className="font-display font-bold text-xl text-[#1a0a00]">RecipeWorld</span>
            </div>
            <p className="text-[#78716c] text-sm leading-relaxed max-w-xs">
              Лучшее кулинарное сообщество, где каждый может поделиться своим шедевром и найти вдохновение для завтрашнего ужина.
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#1a0a00] mb-6">Приложение</h4>
            <ul className="space-y-4 text-sm text-[#78716c]">
              <li>
                <a
                  href="/site-features.html"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D85A30] transition-colors"
                >
                  Функции
                </a>
              </li>
              <li>
                <a
                  href="#recipes-explorer"
                  onClick={(event) => {
                    event.preventDefault();
                    onOpenRecipes();
                  }}
                  className="hover:text-[#D85A30] transition-colors"
                >
                  Рецепты
                </a>
              </li>
              <li>
                <a
                  href="#"
                  onClick={(event) => event.preventDefault()}
                  aria-disabled="true"
                  className="opacity-70 cursor-not-allowed"
                >
                  Сообщество
                </a>
              </li>
              <li>
                <a
                  href="#ai-assistant"
                  onClick={(event) => {
                    event.preventDefault();
                    onOpenAIAssistant();
                  }}
                  className="hover:text-[#D85A30] transition-colors"
                >
                  ИИ-Помощник
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#1a0a00] mb-6">Поддержка</h4>
            <ul className="space-y-4 text-sm text-[#78716c]">
              <li>
                <a
                  href="https://t.me/g0dz3r0bot"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#D85A30] transition-colors"
                >
                  Помощь
                </a>
              </li>
              <li>
                <a href="/security.html" target="_blank" rel="noopener noreferrer" className="hover:text-[#D85A30] transition-colors">
                  Безопасность
                </a>
              </li>
              <li>
                <a href="/terms.html" target="_blank" rel="noopener noreferrer" className="hover:text-[#D85A30] transition-colors">
                  Условия
                </a>
              </li>
              <li>
                <a href="/privacy.html" target="_blank" rel="noopener noreferrer" className="hover:text-[#D85A30] transition-colors">
                  Конфиденциальность
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-[#1a0a00] mb-6">Социальные сети</h4>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#78716c] hover:bg-orange-50 hover:text-[#D85A30] transition-all border border-transparent hover:border-orange-100">
                <Instagram size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#78716c] hover:bg-orange-50 hover:text-[#D85A30] transition-all border border-transparent hover:border-orange-100">
                <Twitter size={20} />
              </a>
              <a href="#" className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#78716c] hover:bg-orange-50 hover:text-[#D85A30] transition-all border border-transparent hover:border-orange-100">
                <Facebook size={20} />
              </a>
            </div>
            <div className="mt-8">
              <h5 className="text-[12px] font-bold text-[#1a0a00] mb-3 uppercase tracking-wider">Связаться с нами</h5>
              <a href="mailto:hello@recipeworld.app" className="flex items-center gap-2 text-sm text-[#78716c] hover:text-[#D85A30] transition-colors">
                <Mail size={16} />
                hello@recipeworld.app
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-orange-50 flex flex-wrap justify-between gap-4 text-[#78716c] text-[12px] font-medium">
          <p>© 2026 RecipeWorld App. Сделано с любовью к еде.</p>
          <div className="flex gap-8">
            <a href="/privacy.html#cookies" target="_blank" rel="noopener noreferrer" className="hover:text-[#D85A30] transition-colors">Cookie Policy</a>
            <a href="/terms.html" target="_blank" rel="noopener noreferrer" className="hover:text-[#D85A30] transition-colors">Legal Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
}