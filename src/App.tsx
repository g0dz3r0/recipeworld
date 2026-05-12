import { useState } from 'react';
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
import { AnimatePresence, motion } from 'motion/react';
import { MockUser } from './data/recipes';

interface Cuisine {
  name: string;
  emoji: string;
  from: string;
  to: string;
}

interface Recipe {
  id: string;
  title: string;
  emoji: string;
  author: string;
  likes: string;
  time: string;
  gradient: string;
}

export default function App() {
  const [selectedCuisine, setSelectedCuisine] = useState<Cuisine | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isExploring, setIsExploring] = useState(false);
  const [isAIActive, setIsAIActive] = useState(false);
  const [profileTab, setProfileTab] = useState<'profile' | 'saved' | 'notifications' | 'settings' | null>(null);
  const [viewingUser, setViewingUser] = useState<MockUser | null>(null);

  const handleBack = () => {
    setSelectedCuisine(null);
    setSelectedRecipe(null);
    setIsExploring(false);
    setIsAIActive(false);
    setProfileTab(null);
    setViewingUser(null);
  };

  const handleLogout = () => {
    handleBack();
    // In a real app, clear auth tokens here
  };

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
        ) : !selectedCuisine && !selectedRecipe && !isExploring && !isAIActive && !profileTab ? (
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
            <Footer />
          </motion.div>
        ) : profileTab ? (
          <ProfileLayout 
            key="profile"
            initialTab={profileTab}
            onBack={handleBack}
            onLogout={handleLogout}
          />
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
              onSelectRecipe={(r) => setSelectedRecipe(r)}
              onAIClick={() => setIsAIActive(true)}
              onNavigateProfile={(tab) => setProfileTab(tab)}
              onLogout={handleLogout}
              onViewUser={(user) => { setIsExploring(false); setViewingUser(user); }}
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
      <Navbar onAIClick={() => setIsAIActive(true)} />
    </div>
  );
}
