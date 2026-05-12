export const MOCK_RECIPES = [
  { id: '1', title: 'Карбонара по-домашнему', category: 'pasta', emoji: '🍝', author: 'Мария', likes: '1.2k', time: '20 мин', difficulty: 'easy', timeRange: '15-30' },
  { id: '2', title: 'Маргарита классик', category: 'pizza', emoji: '🍕', author: 'Луиджи', likes: '3.4k', time: '15 мин', difficulty: 'easy', timeRange: '<15' },
  { id: '3', title: 'Креветки на гриле', category: 'seafood', emoji: '🦐', author: 'Анна', likes: '890', time: '10 мин', difficulty: 'easy', timeRange: '<15' },
  { id: '4', title: 'Тирамису', category: 'desserts', emoji: '🧁', author: 'Павел', likes: '2.1k', time: '40 мин', difficulty: 'medium', timeRange: '>30' },
  { id: '5', title: 'Цезарь с курицей', category: 'salads', emoji: '🥗', author: 'Ольга', likes: '1.5k', time: '25 мин', difficulty: 'easy', timeRange: '15-30' },
  { id: '6', title: 'Феттуччине Альфредо', category: 'pasta', emoji: '🍝', author: 'Марко', likes: '940', time: '30 мин', difficulty: 'medium', timeRange: '15-30' },
];

export interface MockUser {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  role: string;
  followers: string;
  recipesCount: number;
  recipes: string[];
}

export const MOCK_USERS: MockUser[] = [
  { id: 'maria', name: 'Мария Иванова', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', bio: 'Люблю итальянскую кухню и эксперименты с пастой', role: 'Золотой шеф-повар', followers: '3.2k', recipesCount: 47, recipes: ['1'] },
  { id: 'luigi', name: 'Луиджи Верди', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Luigi', bio: 'Пиццайоло из Неаполя. Готовлю пиццу с 12 лет', role: 'Платиновый шеф-повар', followers: '8.1k', recipesCount: 124, recipes: ['2'] },
  { id: 'anna', name: 'Анна Морская', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna', bio: 'Специалист по морепродуктам и средиземноморской кухне', role: 'Серебряный шеф-повар', followers: '1.8k', recipesCount: 32, recipes: ['3'] },
  { id: 'pavel', name: 'Павел Сладков', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Pavel', bio: 'Кондитер-самоучка. Десерты — моя страсть!', role: 'Золотой шеф-повар', followers: '5.4k', recipesCount: 89, recipes: ['4'] },
  { id: 'olga', name: 'Ольга Зеленова', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olga', bio: 'ЗОЖ и правильное питание. Салаты могут быть вкусными!', role: 'Бронзовый шеф-повар', followers: '2.3k', recipesCount: 56, recipes: ['5'] },
  { id: 'marko', name: 'Марко Росси', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marko', bio: 'Шеф-повар ресторана Bella Italia', role: 'Платиновый шеф-повар', followers: '12k', recipesCount: 203, recipes: ['6'] },
  { id: 'aleksandr', name: 'Александр Демидов', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', bio: 'Фанат здоровой пищи и греческой кухни', role: 'Серебряный шеф-повар', followers: '1.5k', recipesCount: 28, recipes: [] },
  { id: 'ivan', name: 'Иван Кулинар', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan', bio: 'Домашняя кухня — лучшая кухня', role: 'Бронзовый шеф-повар', followers: '920', recipesCount: 15, recipes: [] },
  { id: 'elena', name: 'Елена Петрова', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', bio: 'Профессиональный шеф-повар с 10-летним стажем', role: 'Платиновый шеф-повар', followers: '6.7k', recipesCount: 156, recipes: [] },
];

export const findUserByName = (name: string): MockUser => {
  const first = name.split(' ')[0].split('.')[0].trim();
  return MOCK_USERS.find(u => u.name.startsWith(first)) || {
    id: first.toLowerCase(),
    name: name,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${first}`,
    bio: '',
    role: 'Шеф-повар',
    followers: '0',
    recipesCount: 0,
    recipes: [],
  };
};

export const CATEGORIES = [
  { id: 'all', name: 'Все', emoji: '🍽️' },
  { id: 'pasta', name: 'Паста', emoji: '🍝' },
  { id: 'pizza', name: 'Пицца', emoji: '🍕' },
  { id: 'seafood', name: 'Морепродукты', emoji: '🦐' },
  { id: 'desserts', name: 'Десерты', emoji: '🧁' },
  { id: 'salads', name: 'Салаты', emoji: '🥗' },
];
