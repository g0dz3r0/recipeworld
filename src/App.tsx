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
import FollowList from './components/FollowList';
import RecipeList, { RecipeListRecipe } from './components/RecipeList';
import ShoppingList from './components/ShoppingList';
import { useShoppingList } from './lib/shopping';
import { AnimatePresence, motion } from 'motion/react';
import { MockUser, MOCK_USERS, MOCK_RECIPES } from './data/recipes';
import { useTheme, type Theme } from './lib/theme';
import { useProfile, type MyProfile } from './lib/profile';
import { useLikes, useComments, useRatings } from './lib/interactions';

type FollowListView =
  | { kind: 'my-followers' }
  | { kind: 'my-following' }
  | { kind: 'user-followers'; user: MockUser };

type RecipeListView =
  | { kind: 'my-recipes' }
  | { kind: 'user-recipes'; user: MockUser };

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
const FOLLOWING_STORAGE_KEY = 'recipeworld:followingIds';
const FOLLOWERS_STORAGE_KEY = 'recipeworld:followersIds';

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

const readPersistedStringArray = (key: string): string[] | null => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((v): v is string => typeof v === 'string') : null;
  } catch {
    return null;
  }
};

// On first visit we seed 6–9 random MOCK_USERS as "followers" so the profile
// doesn't read "0 подписчиков" out of the gate. Persisted after that — never
// regenerated, so the count stays stable across reloads.
const seedInitialFollowers = (): string[] => {
  const shuffled = [...MOCK_USERS].sort(() => Math.random() - 0.5);
  const count = 6 + Math.floor(Math.random() * 4);
  return shuffled.slice(0, count).map((u) => u.id);
};

export default function App() {
  const [selectedCuisine, setSelectedCuisine] = useState<Cuisine | null>(null);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isExploring, setIsExploring] = useState(false);
  const [isAIActive, setIsAIActive] = useState(false);
  const [isCreatingRecipe, setIsCreatingRecipe] = useState(false);
  const [editingRecipe, setEditingRecipe] = useState<UserRecipeDraft | null>(null);
  const [profileTab, setProfileTab] = useState<'profile' | 'saved' | 'notifications' | 'settings' | null>(null);
  const [followListView, setFollowListView] = useState<FollowListView | null>(null);
  const [recipeListView, setRecipeListView] = useState<RecipeListView | null>(null);
  const [isShoppingOpen, setIsShoppingOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { profile, updateProfile } = useProfile();
  const likes = useLikes();
  const comments = useComments();
  const ratings = useRatings();
  const [viewingUser, setViewingUser] = useState<MockUser | null>(null);
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>(() => readPersistedRecipes<Recipe>(SAVED_RECIPES_STORAGE_KEY));
  const [myRecipes, setMyRecipes] = useState<UserRecipeDraft[]>(() => readPersistedRecipes<UserRecipeDraft>(MY_RECIPES_STORAGE_KEY));
  const [followingIds, setFollowingIds] = useState<string[]>(() => readPersistedStringArray(FOLLOWING_STORAGE_KEY) ?? []);
  const [followersIds, setFollowersIds] = useState<string[]>(() => readPersistedStringArray(FOLLOWERS_STORAGE_KEY) ?? seedInitialFollowers());
  const shopping = useShoppingList(savedRecipes);

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

  useEffect(() => {
    try {
      localStorage.setItem(FOLLOWING_STORAGE_KEY, JSON.stringify(followingIds));
    } catch {
      // ignore persistence errors
    }
  }, [followingIds]);

  useEffect(() => {
    try {
      localStorage.setItem(FOLLOWERS_STORAGE_KEY, JSON.stringify(followersIds));
    } catch {
      // ignore persistence errors
    }
  }, [followersIds]);

  // Global ESC handler: closes the topmost overlay / pops one level back.
  // Skip when focus is in an input/textarea so users can still ESC out of
  // native autocomplete or IME without bouncing the route.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }
      handleBack();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [followListView, recipeListView, isShoppingOpen, selectedCuisine, selectedRecipe, isExploring, isAIActive, isCreatingRecipe, profileTab, viewingUser]);

  const handleToggleFollow = (userId: string) => {
    setFollowingIds((prev) => (prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]));
  };

  const followingUsers = MOCK_USERS.filter((u) => followingIds.includes(u.id));
  const followersUsers = MOCK_USERS.filter((u) => followersIds.includes(u.id));

  // For a public user profile: their mock followers + me if I follow them.
  const SELF_USER: MockUser = {
    id: '__me__',
    name: profile.username,
    avatar: profile.avatarUrl,
    bio: profile.bio || 'Это вы',
    role: 'Шеф-повар',
    followers: String(followersIds.length),
    recipesCount: myRecipes.length,
    recipes: myRecipes.map((r) => String(r.id)),
    followerIds: [],
  };

  const followersOfUser = (user: MockUser): MockUser[] => {
    const base = MOCK_USERS.filter((u) => user.followerIds?.includes(u.id));
    return followingIds.includes(user.id) ? [SELF_USER, ...base] : base;
  };

  const GRADIENT_BY_CATEGORY: Record<string, string> = {
    pasta: 'from-orange-100 to-amber-50',
    pizza: 'from-red-50 to-orange-100',
    seafood: 'from-cyan-50 to-blue-50',
    desserts: 'from-pink-50 to-rose-100',
    salads: 'from-green-50 to-emerald-100',
  };

  const recipesOfUser = (user: MockUser): RecipeListRecipe[] =>
    MOCK_RECIPES.filter((r) => user.recipes.includes(r.id)).map((r) => ({
      ...r,
      gradient: GRADIENT_BY_CATEGORY[r.category] ?? 'from-orange-50 to-amber-50',
    }));

  const myRecipesForList: RecipeListRecipe[] = myRecipes.map((r) => ({
    id: r.id,
    title: r.title,
    emoji: r.emoji,
    author: r.author,
    likes: r.likes,
    time: r.time,
    imageUrl: r.imageUrl,
    difficulty: r.difficulty,
    gradient: r.gradient,
    tags: r.tags,
    description: r.description,
    ingredients: r.ingredients,
    steps: r.steps,
  }));

  const handleBack = () => {
    // Overlay screens (follow list, recipe list) close first so "Назад" feels
    // like one level up rather than dumping the user back at the landing.
    if (followListView) {
      setFollowListView(null);
      return;
    }
    if (recipeListView) {
      setRecipeListView(null);
      return;
    }
    if (isShoppingOpen) {
      setIsShoppingOpen(false);
      return;
    }
    setSelectedCuisine(null);
    setSelectedRecipe(null);
    setIsExploring(false);
    setIsAIActive(false);
    setIsCreatingRecipe(false);
    setEditingRecipe(null);
    setProfileTab(null);
    setViewingUser(null);
  };

  const handleCreateRecipe = (recipe: UserRecipeDraft) => {
    // Pre-flight write so we surface the quota error to the form (where the
    // user can drop the photo and retry) instead of silently swallowing it
    // in the persistence useEffect. Branches on edit vs create: edit replaces
    // the existing entry in-place to preserve list ordering.
    const isEdit = editingRecipe !== null && String(editingRecipe.id) === String(recipe.id);
    const next = isEdit
      ? myRecipes.map((r) => (String(r.id) === String(recipe.id) ? recipe : r))
      : [recipe, ...myRecipes];
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
    setEditingRecipe(null);
    if (isEdit) {
      // Bounce the user back to the (now-updated) recipe detail so the
      // changes are immediately visible.
      setSelectedRecipe(recipe as Recipe);
    } else {
      setIsExploring(true);
    }
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

  // Is this recipe one the current user authored? Used to gate edit/delete UI.
  const isMyRecipe = (recipe: Recipe): boolean =>
    myRecipes.some((r) => String(r.id) === String(recipe.id));

  const handleDeleteRecipe = (recipeId: string | number) => {
    const key = String(recipeId);
    setMyRecipes((prev) => prev.filter((r) => String(r.id) !== key));
    // Drop saved entry too — keeping a "saved" reference to a deleted recipe
    // would break the saved list rendering.
    setSavedRecipes((prev) => prev.filter((r) => String(r.id) !== key));
    setSelectedRecipe(null);
  };

  const findMyRecipe = (recipeId: string | number): UserRecipeDraft | undefined =>
    myRecipes.find((r) => String(r.id) === String(recipeId));

  // Shared page-transition spec — every top-level motion.div uses it so all
  // route changes feel consistent (and slightly more elastic than a flat fade).
  const pageTransition = { duration: 0.35, ease: [0.22, 0.61, 0.36, 1] as const };

  return (
    <div className="min-h-screen selection:bg-orange-100 selection:text-orange-900 overflow-x-hidden bg-[#fdf8f5] dark:bg-[#1a0a00] transition-colors">
      <AnimatePresence mode="wait">
        {followListView ? (
          <motion.div
            key={`follow-list-${followListView.kind}-${followListView.kind === 'user-followers' ? followListView.user.id : 'me'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={pageTransition}
          >
            {followListView.kind === 'my-followers' && (
              <FollowList
                title="Подписчики"
                subtitle="Шеф-повара, которые подписаны на вас"
                users={followersUsers}
                followingIds={followingIds}
                onBack={() => setFollowListView(null)}
                onSelectUser={(user) => { setFollowListView(null); setProfileTab(null); setViewingUser(user); }}
                onToggleFollow={handleToggleFollow}
              />
            )}
            {followListView.kind === 'my-following' && (
              <FollowList
                title="Подписки"
                subtitle="Шеф-повара, на которых вы подписаны"
                users={followingUsers}
                followingIds={followingIds}
                onBack={() => setFollowListView(null)}
                onSelectUser={(user) => { setFollowListView(null); setProfileTab(null); setViewingUser(user); }}
                onToggleFollow={handleToggleFollow}
              />
            )}
            {followListView.kind === 'user-followers' && (
              <FollowList
                title="Подписчики"
                subtitle={`Подписчики ${followListView.user.name}`}
                users={followersOfUser(followListView.user)}
                selfId={SELF_USER.id}
                followingIds={followingIds}
                onBack={() => setFollowListView(null)}
                onSelectUser={(user) => { setFollowListView(null); setViewingUser(user); }}
                onToggleFollow={handleToggleFollow}
              />
            )}
          </motion.div>
        ) : recipeListView ? (
          <motion.div
            key={`recipe-list-${recipeListView.kind}-${recipeListView.kind === 'user-recipes' ? recipeListView.user.id : 'me'}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={pageTransition}
          >
            {recipeListView.kind === 'my-recipes' && (
              <RecipeList
                title="Мои рецепты"
                subtitle="Рецепты, которые вы опубликовали"
                recipes={myRecipesForList}
                emptyStateEmoji="👨‍🍳"
                emptyStateTitle="Вы ещё ничего не опубликовали"
                emptyStateDescription="Поделитесь своим первым рецептом с сообществом — это займёт пару минут."
                onBack={() => setRecipeListView(null)}
                onSelectRecipe={(r) => { setRecipeListView(null); setProfileTab(null); setSelectedRecipe(r as Recipe); }}
                onCreateRecipe={() => { setRecipeListView(null); setProfileTab(null); setIsCreatingRecipe(true); }}
              />
            )}
            {recipeListView.kind === 'user-recipes' && (
              <RecipeList
                title="Рецепты автора"
                subtitle={recipeListView.user.name}
                recipes={recipesOfUser(recipeListView.user)}
                emptyStateEmoji="🍽️"
                emptyStateTitle="У автора пока нет рецептов"
                emptyStateDescription="Загляните позже — лучшие блюда ещё впереди."
                onBack={() => setRecipeListView(null)}
                onSelectRecipe={(r) => { setRecipeListView(null); setSelectedRecipe(r as Recipe); }}
              />
            )}
          </motion.div>
        ) : isShoppingOpen ? (
          <motion.div
            key="shopping-list"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={pageTransition}
          >
            <ShoppingList
              items={shopping.items}
              onBack={() => setIsShoppingOpen(false)}
              onToggle={shopping.toggleItem}
              onAddExtra={shopping.addExtra}
              onRemoveExtra={shopping.removeExtra}
              onClearChecked={shopping.clearChecked}
              onClearAll={shopping.clearAll}
            />
          </motion.div>
        ) : viewingUser ? (
          <motion.div
            key="user-profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={pageTransition}
          >
            <UserProfile
              user={viewingUser}
              onBack={handleBack}
              onSelectRecipe={(r) => { setViewingUser(null); setSelectedRecipe(r); }}
              isFollowing={followingIds.includes(viewingUser.id)}
              onToggleFollow={() => handleToggleFollow(viewingUser.id)}
              followersCount={followersOfUser(viewingUser).length}
              onOpenFollowers={() => setFollowListView({ kind: 'user-followers', user: viewingUser })}
              onOpenRecipes={() => setRecipeListView({ kind: 'user-recipes', user: viewingUser })}
            />
          </motion.div>
        ) : !selectedCuisine && !selectedRecipe && !isExploring && !isAIActive && !profileTab && !isCreatingRecipe ? (
          <motion.div 
            key="landing"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={pageTransition}
          >
            <Hero
              onSelectRecipe={(r) => setSelectedRecipe(r)}
              onExplore={() => setIsExploring(true)}
              onAIClick={() => setIsAIActive(true)}
              onNavigateProfile={(tab) => setProfileTab(tab)}
              onLogout={handleLogout}
              profileAvatarUrl={profile.avatarUrl}
              profileUsername={profile.username}
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
            followingCount={followingIds.length}
            followersCount={followersIds.length}
            onSelectRecipe={(recipe) => { setProfileTab(null); setSelectedRecipe(recipe); }}
            onCreateRecipe={() => { setProfileTab(null); setIsCreatingRecipe(true); }}
            onOpenFollowers={() => setFollowListView({ kind: 'my-followers' })}
            onOpenFollowing={() => setFollowListView({ kind: 'my-following' })}
            onOpenRecipes={() => setRecipeListView({ kind: 'my-recipes' })}
            theme={theme}
            onChangeTheme={setTheme}
            profile={profile}
            onUpdateProfile={updateProfile}
            onOpenShoppingList={() => { setProfileTab(null); setIsShoppingOpen(true); }}
            onBack={handleBack}
            onLogout={handleLogout}
          />
        ) : isCreatingRecipe ? (
          <motion.div
            key="create"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={pageTransition}
          >
            <RecipeCreator
              onBack={handleBack}
              onCreate={handleCreateRecipe}
              initialRecipe={editingRecipe ?? undefined}
              defaultAuthor={profile.username}
            />
          </motion.div>
        ) : isAIActive ? (
          <motion.div
            key="ai"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={pageTransition}
          >
            <AIAssistant
              onBack={handleBack}
              onSelectRecipe={(r) => setSelectedRecipe(r)}
            />
          </motion.div>
        ) : isExploring ? (
          <motion.div 
            key="explore"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={pageTransition}
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
              profileAvatarUrl={profile.avatarUrl}
              profileUsername={profile.username}
            />
          </motion.div>
        ) : selectedRecipe ? (
          <motion.div 
            key="recipe"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={pageTransition}
          >
            <RecipeDetail
              recipe={selectedRecipe}
              onBack={handleBack}
              isSaved={isRecipeSaved(selectedRecipe)}
              onToggleSave={handleToggleSaveRecipe}
              onViewUser={(user) => { setSelectedRecipe(null); setViewingUser(user); }}
              isLiked={likes.isLiked(selectedRecipe.id)}
              onToggleLike={() => likes.toggleLike(selectedRecipe.id)}
              rating={ratings.getRating(selectedRecipe.id)}
              onSetRating={(r) => ratings.setRating(selectedRecipe.id, r)}
              comments={comments.getComments(selectedRecipe.id)}
              currentUserName={profile.username}
              currentUserAvatar={profile.avatarUrl}
              onAddComment={(text) => comments.addComment(selectedRecipe.id, {
                author: profile.username,
                avatarUrl: profile.avatarUrl,
                text,
              })}
              onRemoveComment={(id) => comments.removeComment(selectedRecipe.id, id)}
              canEdit={isMyRecipe(selectedRecipe)}
              onEdit={() => {
                const draft = findMyRecipe(selectedRecipe.id);
                if (draft) {
                  setEditingRecipe(draft);
                  setSelectedRecipe(null);
                  setIsCreatingRecipe(true);
                }
              }}
              onDelete={() => handleDeleteRecipe(selectedRecipe.id)}
            />
          </motion.div>
        ) : (
          <motion.div 
            key="category"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={pageTransition}
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
