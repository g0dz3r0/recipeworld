import { useEffect, useState } from 'react';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Navbar from './components/Navbar';
import CategoryView from './components/CategoryView';
import RecipeDetail from './components/RecipeDetail';
import RecipesExplorer from './components/RecipesExplorer';
import AIAssistant from './components/AIAssistant';
import Footer from './components/Footer';
import ProfileLayout from './components/ProfileLayout';
import UserProfile from './components/UserProfile';
import RecipeCreator, { UserRecipeDraft } from './components/RecipeCreator';
import { AnimatePresence, motion } from 'motion/react';
import { MockUser } from './data/recipes';

interface Cuisine {
  name: string;
  emoji: string;
  from: string;
  to: string;
}

interface Recipe {
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
const SAVED_RECIPES_STORAGE_KEY = 'recipeworld:savedRecipes';
const MY_RECIPES_STORAGE_KEY = 'recipeworld:myRecipes';

const getRecipeKey = (recipe: Recipe) => String(recipe.id);

const readPersistedRecipes = <T,>(key: string): T[] => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
};

export default function App() {
  const [selectedCuisine, setSelectedCuisine] = useState<Cuisine | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isExploring, setIsExploring] = useState(false);
  const [isAIActive, setIsAIActive] = useState(false);
  const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);
  const [profileTab, setProfileTab] = useState<'profile' | 'saved' | 'my-recipes' | 'notifications' | 'settings' | null>(null);
  const [viewingUser, setViewingUser] = useState<MockUser | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>(() => readPersistedRecipes<Recipe>(SAVED_RECIPES_STORAGE_KEY));
  const [myRecipes, setMyRecipes] = useState<UserRecipeDraft[]>(() => readPersistedRecipes<UserRecipeDraft>(MY_RECIPES_STORAGE_KEY));

  useEffect(() => {
    try {
      localStorage.setItem(SAVED_RECIPES_STORAGE_KEY, JSON.stringify(savedRecipes));
    } catch {
      // ignore persistence errors
    }
  }, [savedRecipes]);

  useEffect(() => {
    try {
      localStorage.setItem(MY_RECIPES_STORAGE_KEY, JSON.stringify(myRecipes));
    } catch {
      // ignore persistence errors
    }
  }, [myRecipes]);

  const handleBack = () => {
    setSelectedCuisine(null);
    setSelectedRecipe(null);
    setIsExploring(false);
    setIsAIActive(false);
    setIsCreatingRecipe(false);
    setProfileTab(null);
    setViewingUser(null);
  };

  const handleCreateRecipe = (recipe: UserRecipeDraft) => {
    // Pre-flight write so we surface the quota error to the form (where the
    // user can drop the photo and retry) instead of silently swallowing it
    // in the persistence useEffect.
    const next = [recipe, ...myRecipes];
    try {
      localStorage.setItem(MY_RECIPES_STORAGE_KEY, JSON.stringify(next));
    } catch (err) {
      const isQuota = err instanceof DOMException && (err.name === 'QuotaExceededError' || err.code === 22);
      throw new Error(isQuota
        ? 'Не хватает места в браузере. Попробуйте удалить фото или один из старых рецептов.'
        : 'Не удалось сохранить рецепт. Попробуйте ещё раз.');
    }
    setMyRecipes(next);
    setIsCreatingRecipe(false);
    setIsExploring(true);
  };

  const handleOpenAbout = () => {
    handleBack();
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.getElementById('about-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 80);
    });
  };

  const handleLogout = () => {
    handleBack();
    // In a real app, clear auth tokens here
  };

  const handleToggleSaveRecipe = (recipe: Recipe) => {
    setSavedRecipes((prevSavedRecipes) => {
      const recipeKey = getRecipeKey(recipe);
      const isAlreadySaved = prevSavedRecipes.some((savedRecipe) => getRecipeKey(savedRecipe) === recipeKey);
      if (isAlreadySaved) {
        return prevSavedRecipes.filter((savedRecipe) => getRecipeKey(savedRecipe) !== recipeKey);
      }
      return [...prevSavedRecipes, recipe];
    });
  };

  const isRecipeSaved = (recipe: Recipe) =>
    savedRecipes.some((savedRecipe) => getRecipeKey(savedRecipe) === getRecipeKey(recipe));

  return (
    <div className="min-h-screen selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden">
      <AnimatePresence mode="wait">
        {viewingUser ? (
          <motion.div
            key="user-profile"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <UserProfile
              user={viewingUser}
              onBack={handleBack}
              onSelectRecipe={(r) => { setViewingUser(null); setSelectedRecipe(r); }}
            />
          </motion.div>
        ) : !selectedCuisine && !selectedRecipe && !isExploring && !isAIActive && !profileTab && !isCreatingRecipe ? (
          <motion.div 
            key="landing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Hero 
              onSelectRecipe={(r) => setSelectedRecipe(r)} 
              onExplore={() => setIsExploring(true)}
              onAIClick={() => setIsAIActive(true)}
              onNavigateProfile={(tab) => setProfileTab(tab)}
              onLogout={handleLogout}
            />
            <Marquee onSelectCuisine={(c) => setSelectedCuisine(c)} />
            <Footer
              onOpenRecipes={() => setIsExploring(true)}
              onOpenAIAssistant={() => setIsAIActive(true)}
            />
          </motion.div>
        ) : profileTab ? (
          <ProfileLayout
            key="profile"
            initialTab={profileTab}
            savedRecipes={savedRecipes}
            myRecipes={myRecipes}
            onSelectRecipe={(recipe) => { setProfileTab(null); setSelectedRecipe(recipe); }}
            onCreateRecipe={() => { setProfileTab(null); setIsCreatingRecipe(true); }}
            onBack={handleBack}
            onLogout={handleLogout}
          />
        ) : isCreatingRecipe ? (
          <motion.div
            key="create"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <RecipeCreator
              onBack={handleBack}
              onCreate={handleCreateRecipe}
            />
          </motion.div>
        ) : isAIActive ? (
          <motion.div
            key="ai"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <AIAssistant
              onBack={handleBack}
              onSelectRecipe={(r) => setSelectedRecipe(r)}
            />
          </motion.div>
        ) : isExploring ? (
          <motion.div 
            key="explore"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <RecipesExplorer
              onBack={handleBack}
              onSelectRecipe={(r) => { setIsExploring(false); setSelectedRecipe(r); }}
              onAIClick={() => setIsAIActive(true)}
              onNavigateProfile={(tab) => setProfileTab(tab)}
              onLogout={handleLogout}
              onViewUser={(user) => { setIsExploring(false); setViewingUser(user); }}
              extraRecipes={myRecipes}
              onCreateRecipe={() => { setIsExploring(false); setIsCreatingRecipe(true); }}
            />
          </motion.div>
        ) : selectedRecipe ? (
          <motion.div 
            key="recipe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <RecipeDetail
              recipe={selectedRecipe}
              onBack={handleBack}
              isSaved={isRecipeSaved(selectedRecipe)}
              onToggleSave={handleToggleSaveRecipe}
              onViewUser={(user) => { setSelectedRecipe(null); setViewingUser(user); }}
            />
          </motion.div>
        ) : (
          <motion.div 
            key="category"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <CategoryView
              cuisine={selectedCuisine!}
              onBack={handleBack}
              onSelectRecipe={(r) => { setSelectedCuisine(null); setSelectedRecipe(r); }}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <Navbar onAIClick={() => setIsAIActive(true)} onAboutClick={handleOpenAbout} />
    </div>
  );
}
