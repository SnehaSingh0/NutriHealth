export interface FoodItem {
  name: string;
  aliases?: string[];
  units: { name: string; grams: number }[];
  defaultUnit: string;
  calories: number;
  carbs: number;
  protein: number;
  fats: number;
  category: string;
}

export const FOOD_DATABASE: FoodItem[] = [
  // INDIAN BREAD
  { name: 'Chapati', aliases: ['roti', 'wheat bread'], units: [{ name: '1 piece', grams: 50 }, { name: '2 pieces', grams: 100 }, { name: '3 pieces', grams: 150 }, { name: 'grams', grams: 1 }], defaultUnit: '1 piece', calories: 155, carbs: 29, protein: 5, fats: 1, category: 'Indian Bread' },
  { name: 'Naan', aliases: ['tandoori bread'], units: [{ name: '1 piece', grams: 100 }, { name: '½ piece', grams: 50 }, { name: 'grams', grams: 1 }], defaultUnit: '1 piece', calories: 262, carbs: 51, protein: 8, fats: 3, category: 'Indian Bread' },
  { name: 'Paratha', aliases: ['aloo paratha', 'butter paratha'], units: [{ name: '1 piece', grams: 80 }, { name: '2 pieces', grams: 160 }, { name: '3 pieces', grams: 240 }, { name: 'grams', grams: 1 }], defaultUnit: '1 piece', calories: 234, carbs: 28, protein: 4, fats: 12, category: 'Indian Bread' },
  { name: 'Puri', units: [{ name: '1 piece', grams: 40 }, { name: '2 pieces', grams: 80 }, { name: 'grams', grams: 1 }], defaultUnit: '1 piece', calories: 298, carbs: 30, protein: 5, fats: 17, category: 'Indian Bread' },

  // GRAINS & RICE
  { name: 'White Rice', aliases: ['rice', 'white rice cooked'], units: [{ name: '1 bowl', grams: 200 }, { name: '1 cup', grams: 150 }, { name: '½ cup', grams: 75 }, { name: 'grams', grams: 1 }], defaultUnit: '1 cup', calories: 130, carbs: 28, protein: 2.7, fats: 0.3, category: 'Grains' },
  { name: 'Brown Rice', units: [{ name: '1 cup', grams: 150 }, { name: '1 bowl', grams: 200 }, { name: '½ cup', grams: 75 }, { name: 'grams', grams: 1 }], defaultUnit: '1 cup', calories: 111, carbs: 23, protein: 2.6, fats: 0.9, category: 'Grains' },
  { name: 'Quinoa', units: [{ name: '1 cup', grams: 185 }, { name: '½ cup', grams: 92 }, { name: 'grams', grams: 1 }], defaultUnit: '1 cup', calories: 222, carbs: 39, protein: 8, fats: 4, category: 'Grains' },

  // CURRIES & INDIAN MAIN
  { name: 'Dal Tadka', aliases: ['dal', 'lentil curry'], units: [{ name: '1 bowl', grams: 250 }, { name: '1 cup', grams: 200 }, { name: '½ cup', grams: 100 }, { name: 'grams', grams: 1 }], defaultUnit: '1 cup', calories: 102, carbs: 18, protein: 9, fats: 2, category: 'Curries' },
  { name: 'Paneer Curry', aliases: ['paneer masala', 'shahi paneer'], units: [{ name: '1 serving', grams: 150 }, { name: '1 cup', grams: 200 }, { name: '½ cup', grams: 100 }, { name: 'grams', grams: 1 }], defaultUnit: '1 serving', calories: 215, carbs: 5, protein: 16, fats: 15, category: 'Curries' },
  { name: 'Chicken Curry', aliases: ['chicken masala', 'butter chicken'], units: [{ name: '1 serving', grams: 150 }, { name: '1 cup', grams: 240 }, { name: '½ cup', grams: 120 }, { name: 'grams', grams: 1 }], defaultUnit: '1 serving', calories: 165, carbs: 3, protein: 20, fats: 9, category: 'Curries' },
  { name: 'Fish Curry', units: [{ name: '1 serving', grams: 150 }, { name: '1 cup', grams: 240 }, { name: 'grams', grams: 1 }], defaultUnit: '1 serving', calories: 140, carbs: 2, protein: 18, fats: 7, category: 'Curries' },
  { name: 'Aloo Gobi', aliases: ['potato cauliflower'], units: [{ name: '1 serving', grams: 150 }, { name: '1 cup', grams: 200 }, { name: '½ cup', grams: 100 }, { name: 'grams', grams: 1 }], defaultUnit: '1 serving', calories: 98, carbs: 18, protein: 3, fats: 2, category: 'Vegetables' },
  { name: 'Chole Bhature', aliases: ['chickpea curry'], units: [{ name: '1 serving', grams: 250 }, { name: '1 bhature', grams: 150 }, { name: 'grams', grams: 1 }], defaultUnit: '1 serving', calories: 382, carbs: 52, protein: 12, fats: 15, category: 'Curries' },

  // INDIAN BREAKFAST
  { name: 'Dosa', aliases: ['masala dosa'], units: [{ name: '1 piece', grams: 150 }, { name: '2 pieces', grams: 300 }, { name: 'grams', grams: 1 }], defaultUnit: '1 piece', calories: 168, carbs: 28, protein: 2, fats: 5, category: 'Indian Breakfast' },
  { name: 'Idli', units: [{ name: '1 piece', grams: 80 }, { name: '2 pieces', grams: 160 }, { name: '3 pieces', grams: 240 }, { name: 'grams', grams: 1 }], defaultUnit: '2 pieces', calories: 95, carbs: 22, protein: 2, fats: 0, category: 'Indian Breakfast' },
  { name: 'Upma', units: [{ name: '1 bowl', grams: 200 }, { name: '1 cup', grams: 150 }, { name: '½ cup', grams: 75 }, { name: 'grams', grams: 1 }], defaultUnit: '1 bowl', calories: 130, carbs: 20, protein: 4, fats: 4, category: 'Indian Breakfast' },
  { name: 'Poha', aliases: ['flattened rice'], units: [{ name: '1 serving', grams: 150 }, { name: '1 cup', grams: 200 }, { name: '½ cup', grams: 100 }, { name: 'grams', grams: 1 }], defaultUnit: '1 serving', calories: 130, carbs: 29, protein: 2, fats: 1, category: 'Indian Breakfast' },

  // STREET FOOD
  { name: 'Samosa', units: [{ name: '1 piece', grams: 60 }, { name: '2 pieces', grams: 120 }, { name: '3 pieces', grams: 180 }, { name: 'grams', grams: 1 }], defaultUnit: '1 piece', calories: 206, carbs: 21, protein: 3, fats: 11, category: 'Street Food' },
  { name: 'Spring Roll', units: [{ name: '1 piece', grams: 70 }, { name: '2 pieces', grams: 140 }, { name: 'grams', grams: 1 }], defaultUnit: '1 piece', calories: 205, carbs: 25, protein: 3, fats: 10, category: 'Street Food' },
  { name: 'Vada', units: [{ name: '1 piece', grams: 80 }, { name: '2 pieces', grams: 160 }, { name: 'grams', grams: 1 }], defaultUnit: '2 pieces', calories: 307, carbs: 35, protein: 5, fats: 16, category: 'Street Food' },
  { name: 'Pakora', aliases: ['fritters'], units: [{ name: '1 piece', grams: 40 }, { name: '2 pieces', grams: 80 }, { name: '5 pieces', grams: 200 }, { name: 'grams', grams: 1 }], defaultUnit: '2 pieces', calories: 280, carbs: 23, protein: 4, fats: 18, category: 'Street Food' },
  { name: 'Chaat', aliases: ['pani puri', 'bhel puri'], units: [{ name: '1 serving', grams: 150 }, { name: 'grams', grams: 1 }], defaultUnit: '1 serving', calories: 180, carbs: 28, protein: 3, fats: 6, category: 'Street Food' },
  { name: 'Momos', units: [{ name: '1 piece', grams: 40 }, { name: '5 pieces', grams: 200 }, { name: '10 pieces', grams: 400 }, { name: 'grams', grams: 1 }], defaultUnit: '5 pieces', calories: 280, carbs: 35, protein: 8, fats: 10, category: 'Street Food' },

  // VEGETABLES
  { name: 'Carrot', units: [{ name: '1 medium', grams: 100 }, { name: '½ cup', grams: 80 }, { name: '1 bowl', grams: 150 }, { name: 'grams', grams: 1 }], defaultUnit: '1 medium', calories: 41, carbs: 10, protein: 0.9, fats: 0.2, category: 'Vegetables' },
  { name: 'Broccoli', units: [{ name: '1 cup', grams: 150 }, { name: '½ cup', grams: 75 }, { name: '1 head', grams: 600 }, { name: 'grams', grams: 1 }], defaultUnit: '1 cup', calories: 34, carbs: 7, protein: 2.8, fats: 0.4, category: 'Vegetables' },
  { name: 'Spinach', units: [{ name: '1 cup', grams: 150 }, { name: '½ cup', grams: 75 }, { name: '1 bowl', grams: 200 }, { name: 'grams', grams: 1 }], defaultUnit: '1 cup', calories: 23, carbs: 4, protein: 3, fats: 0.4, category: 'Vegetables' },
  { name: 'Tomato', units: [{ name: '1 medium', grams: 123 }, { name: 'slices', grams: 25 }, { name: '½ cup', grams: 90 }, { name: 'grams', grams: 1 }], defaultUnit: '1 medium', calories: 22, carbs: 5, protein: 1, fats: 0.2, category: 'Vegetables' },
  { name: 'Cucumber', units: [{ name: '1 medium', grams: 150 }, { name: 'slices', grams: 25 }, { name: '½ cup', grams: 75 }, { name: 'grams', grams: 1 }], defaultUnit: '1 medium', calories: 16, carbs: 4, protein: 0.7, fats: 0.1, category: 'Vegetables' },
  { name: 'Onion', units: [{ name: '1 medium', grams: 150 }, { name: '1 cup chopped', grams: 150 }, { name: 'grams', grams: 1 }], defaultUnit: '1 medium', calories: 44, carbs: 10, protein: 1.1, fats: 0.1, category: 'Vegetables' },

  // FRUITS
  { name: 'Banana', units: [{ name: '1 medium', grams: 118 }, { name: '1 small', grams: 80 }, { name: '1 large', grams: 150 }, { name: 'grams', grams: 1 }], defaultUnit: '1 medium', calories: 89, carbs: 23, protein: 1.1, fats: 0.3, category: 'Fruits' },
  { name: 'Apple', units: [{ name: '1 medium', grams: 150 }, { name: '1 small', grams: 120 }, { name: '1 large', grams: 180 }, { name: 'grams', grams: 1 }], defaultUnit: '1 medium', calories: 81, carbs: 22, protein: 0.3, fats: 0.2, category: 'Fruits' },
  { name: 'Orange', units: [{ name: '1 medium', grams: 131 }, { name: '1 small', grams: 100 }, { name: '1 large', grams: 160 }, { name: 'grams', grams: 1 }], defaultUnit: '1 medium', calories: 62, carbs: 15, protein: 1.2, fats: 0.3, category: 'Fruits' },
  { name: 'Mango', units: [{ name: '1 medium', grams: 165 }, { name: '1 cup sliced', grams: 165 }, { name: 'grams', grams: 1 }], defaultUnit: '1 medium', calories: 99, carbs: 25, protein: 0.8, fats: 0.3, category: 'Fruits' },
  { name: 'Pomegranate', aliases: ['arils'], units: [{ name: '1 cup', grams: 150 }, { name: 'half fruit', grams: 100 }, { name: 'grams', grams: 1 }], defaultUnit: '1 cup', calories: 83, carbs: 19, protein: 1.7, fats: 1.2, category: 'Fruits' },
  { name: 'Watermelon', units: [{ name: '1 cup', grams: 150 }, { name: '1 slice', grams: 250 }, { name: '½ cup', grams: 75 }, { name: 'grams', grams: 1 }], defaultUnit: '1 cup', calories: 46, carbs: 11, protein: 0.9, fats: 0.2, category: 'Fruits' },

  // PROTEINS
  { name: 'Chicken Breast', aliases: ['boiled chicken', 'grilled chicken'], units: [{ name: '100g', grams: 100 }, { name: '150g', grams: 150 }, { name: '200g', grams: 200 }, { name: 'grams', grams: 1 }], defaultUnit: '100g', calories: 165, carbs: 0, protein: 31, fats: 3.6, category: 'Protein' },
  { name: 'Paneer', aliases: ['cottage cheese'], units: [{ name: '100g', grams: 100 }, { name: '150g', grams: 150 }, { name: '1 cup cubed', grams: 150 }, { name: 'grams', grams: 1 }], defaultUnit: '100g', calories: 265, carbs: 3.6, protein: 25, fats: 17, category: 'Protein' },
  { name: 'Fish', units: [{ name: '100g', grams: 100 }, { name: '150g', grams: 150 }, { name: '200g', grams: 200 }, { name: 'grams', grams: 1 }], defaultUnit: '100g', calories: 82, carbs: 0, protein: 18, fats: 0.7, category: 'Protein' },
  { name: 'Tofu', units: [{ name: '100g', grams: 100 }, { name: '150g', grams: 150 }, { name: '1 cup', grams: 150 }, { name: 'grams', grams: 1 }], defaultUnit: '100g', calories: 76, carbs: 1.9, protein: 8.1, fats: 4.8, category: 'Protein' },

  // DAIRY
  { name: 'Milk', units: [{ name: '1 glass', grams: 200 }, { name: '1 cup', grams: 240 }, { name: '½ cup', grams: 120 }, { name: 'ml', grams: 1 }], defaultUnit: '1 glass', calories: 61, carbs: 4.8, protein: 3.2, fats: 3.3, category: 'Dairy' },
  { name: 'Yogurt', units: [{ name: '1 cup', grams: 200 }, { name: '½ cup', grams: 100 }, { name: '1 bowl', grams: 250 }, { name: 'grams', grams: 1 }], defaultUnit: '1 cup', calories: 100, carbs: 11, protein: 10, fats: 0, category: 'Dairy' },
  { name: 'Cheese', aliases: ['cheddar'], units: [{ name: '1 slice', grams: 30 }, { name: '1 oz', grams: 28 }, { name: '100g', grams: 100 }, { name: 'grams', grams: 1 }], defaultUnit: '1 slice', calories: 113, carbs: 0.4, protein: 7, fats: 9.4, category: 'Dairy' },
  { name: 'Eggs', units: [{ name: '1 egg', grams: 50 }, { name: '2 eggs', grams: 100 }, { name: 'grams', grams: 1 }], defaultUnit: '1 egg', calories: 155, carbs: 1.1, protein: 13, fats: 11, category: 'Protein' },

  // BEVERAGES
  { name: 'Coffee', aliases: ['black coffee'], units: [{ name: '1 cup', grams: 240 }, { name: '½ cup', grams: 120 }, { name: 'ml', grams: 1 }], defaultUnit: '1 cup', calories: 2, carbs: 0, protein: 0.3, fats: 0, category: 'Beverages' },
  { name: 'Tea', aliases: ['black tea', 'green tea'], units: [{ name: '1 cup', grams: 240 }, { name: '½ cup', grams: 120 }, { name: 'ml', grams: 1 }], defaultUnit: '1 cup', calories: 2, carbs: 0, protein: 0, fats: 0, category: 'Beverages' },
  { name: 'Orange Juice', units: [{ name: '1 glass', grams: 200 }, { name: '1 cup', grams: 240 }, { name: 'ml', grams: 1 }], defaultUnit: '1 glass', calories: 85, carbs: 21, protein: 1.7, fats: 0.5, category: 'Beverages' },
  { name: 'Smoothie', units: [{ name: '1 glass', grams: 250 }, { name: '1 bowl', grams: 300 }, { name: 'grams', grams: 1 }], defaultUnit: '1 glass', calories: 150, carbs: 28, protein: 5, fats: 3, category: 'Beverages' },
  { name: 'Beer', units: [{ name: '1 bottle', grams: 355 }, { name: '1 pint', grams: 473 }, { name: 'ml', grams: 1 }], defaultUnit: '1 bottle', calories: 154, carbs: 11, protein: 1.6, fats: 0, category: 'Beverages' },

  // FAST FOOD & INTERNATIONAL
  { name: 'Pizza', units: [{ name: '1 slice', grams: 100 }, { name: '2 slices', grams: 200 }, { name: '1 whole', grams: 800 }, { name: 'grams', grams: 1 }], defaultUnit: '1 slice', calories: 285, carbs: 36, protein: 12, fats: 10, category: 'Fast Food' },
  { name: 'Burger', aliases: ['hamburger', 'cheese burger'], units: [{ name: '1 burger', grams: 200 }, { name: '2 burgers', grams: 400 }, { name: 'grams', grams: 1 }], defaultUnit: '1 burger', calories: 354, carbs: 36, protein: 15, fats: 17, category: 'Fast Food' },
  { name: 'Pasta', aliases: ['spaghetti', 'carbonara'], units: [{ name: '1 serving', grams: 200 }, { name: '1 cup', grams: 150 }, { name: '½ cup', grams: 75 }, { name: 'grams', grams: 1 }], defaultUnit: '1 serving', calories: 220, carbs: 42, protein: 8, fats: 1.1, category: 'International' },
  { name: 'Sandwich', aliases: ['sub', 'wrap'], units: [{ name: '1 sandwich', grams: 250 }, { name: 'grams', grams: 1 }], defaultUnit: '1 sandwich', calories: 280, carbs: 35, protein: 12, fats: 9, category: 'Fast Food' },

  // SNACKS
  { name: 'Almonds', units: [{ name: '1 handful', grams: 23 }, { name: '10 pieces', grams: 10 }, { name: '1 oz', grams: 28 }, { name: 'grams', grams: 1 }], defaultUnit: '1 handful', calories: 164, carbs: 6, protein: 6, fats: 14, category: 'Snacks' },
  { name: 'Peanuts', units: [{ name: '1 handful', grams: 30 }, { name: '1 oz', grams: 28 }, { name: 'grams', grams: 1 }], defaultUnit: '1 handful', calories: 160, carbs: 5.7, protein: 5.5, fats: 14, category: 'Snacks' },
  { name: 'Chips', aliases: ['potato chips', 'crisps'], units: [{ name: '1 serving', grams: 30 }, { name: '1 handful', grams: 20 }, { name: '1 bag', grams: 60 }, { name: 'grams', grams: 1 }], defaultUnit: '1 serving', calories: 152, carbs: 15, protein: 2.1, fats: 9.3, category: 'Snacks' },
  { name: 'Popcorn', units: [{ name: '1 cup', grams: 25 }, { name: '3 cups', grams: 75 }, { name: 'grams', grams: 1 }], defaultUnit: '1 cup', calories: 31, carbs: 6.2, protein: 1, fats: 0.4, category: 'Snacks' },
  { name: 'Dark Chocolate', units: [{ name: '1 piece', grams: 10 }, { name: '1 bar', grams: 45 }, { name: 'grams', grams: 1 }], defaultUnit: '1 piece', calories: 53, carbs: 5, protein: 1, fats: 3, category: 'Snacks' },

  // DIET FOODS
  { name: 'Oats', units: [{ name: '½ cup', grams: 40 }, { name: '1 cup', grams: 80 }, { name: 'grams', grams: 1 }], defaultUnit: '½ cup', calories: 150, carbs: 27, protein: 5, fats: 3, category: 'Diet Food' },
  { name: 'Granola', units: [{ name: '1 bowl', grams: 150 }, { name: '½ cup', grams: 50 }, { name: 'grams', grams: 1 }], defaultUnit: '½ cup', calories: 200, carbs: 30, protein: 4, fats: 8, category: 'Diet Food' },
  { name: 'Salad', aliases: ['green salad', 'mixed salad'], units: [{ name: '1 bowl', grams: 200 }, { name: '1 cup', grams: 150 }, { name: 'grams', grams: 1 }], defaultUnit: '1 bowl', calories: 32, carbs: 6, protein: 2.4, fats: 0.3, category: 'Diet Food' },

  // BREAKFAST FOODS
  { name: 'Pancakes', aliases: ['crepes', 'flapjacks'], units: [{ name: '1 pancake', grams: 60 }, { name: '2 pancakes', grams: 120 }, { name: '3 pancakes', grams: 180 }, { name: 'grams', grams: 1 }], defaultUnit: '2 pancakes', calories: 175, carbs: 28, protein: 5, fats: 5, category: 'Breakfast' },
  { name: 'Waffles', units: [{ name: '1 waffle', grams: 75 }, { name: '2 waffles', grams: 150 }, { name: 'grams', grams: 1 }], defaultUnit: '1 waffle', calories: 220, carbs: 25, protein: 6, fats: 11, category: 'Breakfast' },
  { name: 'Omelette', aliases: ['egg omelette'], units: [{ name: '1 omelette', grams: 100 }, { name: '½ omelette', grams: 50 }, { name: 'grams', grams: 1 }], defaultUnit: '1 omelette', calories: 155, carbs: 1.1, protein: 13, fats: 11, category: 'Breakfast' },
  { name: 'Bacon', units: [{ name: '2 slices', grams: 14 }, { name: '4 slices', grams: 28 }, { name: '6 slices', grams: 42 }, { name: 'grams', grams: 1 }], defaultUnit: '2 slices', calories: 94, carbs: 0, protein: 6, fats: 8, category: 'Breakfast' },
  { name: 'Sausage', aliases: ['pork sausage'], units: [{ name: '1 link', grams: 45 }, { name: '2 links', grams: 90 }, { name: '100g', grams: 100 }, { name: 'grams', grams: 1 }], defaultUnit: '2 links', calories: 217, carbs: 1, protein: 12, fats: 18, category: 'Breakfast' },
  { name: 'Toast', aliases: ['bread toast'], units: [{ name: '1 slice', grams: 30 }, { name: '2 slices', grams: 60 }, { name: 'grams', grams: 1 }], defaultUnit: '2 slices', calories: 165, carbs: 30, protein: 6, fats: 2, category: 'Breakfast' },
  { name: 'Cereal', units: [{ name: '1 cup', grams: 30 }, { name: '½ cup', grams: 15 }, { name: '1 bowl', grams: 60 }, { name: 'grams', grams: 1 }], defaultUnit: '1 cup', calories: 100, carbs: 24, protein: 2, fats: 0.5, category: 'Breakfast' },
  { name: 'Croissant', units: [{ name: '1 piece', grams: 57 }, { name: '2 pieces', grams: 114 }, { name: 'grams', grams: 1 }], defaultUnit: '1 piece', calories: 272, carbs: 31, protein: 6, fats: 14, category: 'Breakfast' },

  // DESSERTS
  { name: 'Cake', aliases: ['chocolate cake', 'vanilla cake'], units: [{ name: '1 slice', grams: 80 }, { name: '2 slices', grams: 160 }, { name: '1 piece', grams: 100 }, { name: 'grams', grams: 1 }], defaultUnit: '1 slice', calories: 320, carbs: 45, protein: 4, fats: 14, category: 'Desserts' },
  { name: 'Ice Cream', units: [{ name: '1 cup', grams: 100 }, { name: '½ cup', grams: 50 }, { name: '1 scoop', grams: 65 }, { name: 'grams', grams: 1 }], defaultUnit: '1 scoop', calories: 137, carbs: 16, protein: 2.4, fats: 7.6, category: 'Desserts' },
  { name: 'Cookies', aliases: ['chocolate chip cookies', 'biscuits'], units: [{ name: '1 cookie', grams: 40 }, { name: '2 cookies', grams: 80 }, { name: '3 cookies', grams: 120 }, { name: 'grams', grams: 1 }], defaultUnit: '1 cookie', calories: 140, carbs: 18, protein: 2, fats: 6, category: 'Desserts' },
  { name: 'Donut', aliases: ['doughnut'], units: [{ name: '1 donut', grams: 60 }, { name: '2 donuts', grams: 120 }, { name: 'grams', grams: 1 }], defaultUnit: '1 donut', calories: 270, carbs: 29, protein: 3, fats: 15, category: 'Desserts' },
  { name: 'Brownie', units: [{ name: '1 piece', grams: 60 }, { name: '2 pieces', grams: 120 }, { name: 'grams', grams: 1 }], defaultUnit: '1 piece', calories: 249, carbs: 32, protein: 3, fats: 12, category: 'Desserts' },
  { name: 'Cheesecake', units: [{ name: '1 slice', grams: 100 }, { name: '2 slices', grams: 200 }, { name: 'grams', grams: 1 }], defaultUnit: '1 slice', calories: 321, carbs: 20, protein: 7, fats: 25, category: 'Desserts' },

  // ASIAN FOODS
  { name: 'Sushi', aliases: ['rice rolls', 'sushi rolls'], units: [{ name: '5 pieces', grams: 150 }, { name: '8 pieces', grams: 240 }, { name: '1 roll', grams: 100 }, { name: 'grams', grams: 1 }], defaultUnit: '5 pieces', calories: 200, carbs: 30, protein: 10, fats: 5, category: 'Asian' },
  { name: 'Pad Thai', units: [{ name: '1 serving', grams: 250 }, { name: '1 cup', grams: 200 }, { name: 'grams', grams: 1 }], defaultUnit: '1 serving', calories: 400, carbs: 45, protein: 15, fats: 17, category: 'Asian' },
  { name: 'Fried Rice', aliases: ['egg fried rice', 'chicken fried rice'], units: [{ name: '1 cup', grams: 150 }, { name: '1 bowl', grams: 250 }, { name: '½ cup', grams: 75 }, { name: 'grams', grams: 1 }], defaultUnit: '1 cup', calories: 238, carbs: 27, protein: 6, fats: 13, category: 'Asian' },
  { name: 'Ramen', units: [{ name: '1 bowl', grams: 300 }, { name: '½ bowl', grams: 150 }, { name: 'grams', grams: 1 }], defaultUnit: '1 bowl', calories: 380, carbs: 52, protein: 16, fats: 13, category: 'Asian' },
  { name: 'Lo Mein', units: [{ name: '1 serving', grams: 250 }, { name: '1 cup', grams: 200 }, { name: 'grams', grams: 1 }], defaultUnit: '1 serving', calories: 280, carbs: 38, protein: 10, fats: 10, category: 'Asian' },
  { name: 'Dumplings', units: [{ name: '5 pieces', grams: 150 }, { name: '10 pieces', grams: 300 }, { name: '1 piece', grams: 30 }, { name: 'grams', grams: 1 }], defaultUnit: '5 pieces', calories: 270, carbs: 28, protein: 12, fats: 12, category: 'Asian' },

  // MEDITERRANEAN FOODS
  { name: 'Hummus', units: [{ name: '⅓ cup', grams: 80 }, { name: '½ cup', grams: 120 }, { name: '2 tbsp', grams: 30 }, { name: 'grams', grams: 1 }], defaultUnit: '⅓ cup', calories: 200, carbs: 19, protein: 6, fats: 10, category: 'Mediterranean' },
  { name: 'Falafel', units: [{ name: '1 piece', grams: 50 }, { name: '3 pieces', grams: 150 }, { name: '5 pieces', grams: 250 }, { name: 'grams', grams: 1 }], defaultUnit: '3 pieces', calories: 340, carbs: 33, protein: 12, fats: 17, category: 'Mediterranean' },
  { name: 'Tzatziki', units: [{ name: '⅓ cup', grams: 80 }, { name: '½ cup', grams: 120 }, { name: '1 tbsp', grams: 15 }, { name: 'grams', grams: 1 }], defaultUnit: '⅓ cup', calories: 60, carbs: 2, protein: 3, fats: 4, category: 'Mediterranean' },
  { name: 'Greek Salad', units: [{ name: '1 bowl', grams: 250 }, { name: '1 cup', grams: 200 }, { name: 'grams', grams: 1 }], defaultUnit: '1 bowl', calories: 188, carbs: 15, protein: 8, fats: 13, category: 'Mediterranean' },
  { name: 'Feta Cheese', units: [{ name: '1 oz', grams: 28 }, { name: '¼ cup', grams: 50 }, { name: '100g', grams: 100 }, { name: 'grams', grams: 1 }], defaultUnit: '1 oz', calories: 75, carbs: 1.2, protein: 5.1, fats: 6, category: 'Mediterranean' },

  // AMERICAN FOODS
  { name: 'Hot Dog', aliases: ['frankfurter'], units: [{ name: '1 hot dog', grams: 100 }, { name: '2 hot dogs', grams: 200 }, { name: 'grams', grams: 1 }], defaultUnit: '1 hot dog', calories: 290, carbs: 2, protein: 12, fats: 25, category: 'American' },
  { name: 'Steak', units: [{ name: '100g', grams: 100 }, { name: '150g', grams: 150 }, { name: '200g', grams: 200 }, { name: 'grams', grams: 1 }], defaultUnit: '150g', calories: 271, carbs: 0, protein: 26, fats: 17, category: 'American' },
  { name: 'Mac & Cheese', units: [{ name: '1 cup', grams: 200 }, { name: '1 serving', grams: 250 }, { name: '½ cup', grams: 100 }, { name: 'grams', grams: 1 }], defaultUnit: '1 cup', calories: 390, carbs: 31, protein: 17, fats: 24, category: 'American' },
  { name: 'Fried Chicken', aliases: ['chicken wings', 'drumstick'], units: [{ name: '1 piece', grams: 100 }, { name: '2 pieces', grams: 200 }, { name: '3 pieces', grams: 300 }, { name: 'grams', grams: 1 }], defaultUnit: '1 piece', calories: 330, carbs: 11, protein: 23, fats: 24, category: 'American' },
  { name: 'Mashed Potatoes', units: [{ name: '1 cup', grams: 200 }, { name: '½ cup', grams: 100 }, { name: '1 serving', grams: 150 }, { name: 'grams', grams: 1 }], defaultUnit: '1 cup', calories: 215, carbs: 25, protein: 4, fats: 10, category: 'American' },
  { name: 'Corn', units: [{ name: '1 cup', grams: 145 }, { name: '1 cob', grams: 100 }, { name: '½ cup', grams: 73 }, { name: 'grams', grams: 1 }], defaultUnit: '1 cup', calories: 123, carbs: 27, protein: 4.2, fats: 1.5, category: 'Vegetables' },

  // MEXICAN FOODS
  { name: 'Tacos', units: [{ name: '1 taco', grams: 100 }, { name: '2 tacos', grams: 200 }, { name: '3 tacos', grams: 300 }, { name: 'grams', grams: 1 }], defaultUnit: '2 tacos', calories: 226, carbs: 18, protein: 12, fats: 13, category: 'Mexican' },
  { name: 'Burritos', units: [{ name: '1 burrito', grams: 250 }, { name: '½ burrito', grams: 125 }, { name: 'grams', grams: 1 }], defaultUnit: '1 burrito', calories: 400, carbs: 45, protein: 15, fats: 18, category: 'Mexican' },
  { name: 'Nachos', units: [{ name: '1 serving', grams: 150 }, { name: '2 servings', grams: 300 }, { name: '½ serving', grams: 75 }, { name: 'grams', grams: 1 }], defaultUnit: '1 serving', calories: 354, carbs: 36, protein: 10, fats: 18, category: 'Mexican' },
  { name: 'Enchiladas', units: [{ name: '1 enchilada', grams: 150 }, { name: '2 enchiladas', grams: 300 }, { name: 'grams', grams: 1 }], defaultUnit: '1 enchilada', calories: 320, carbs: 38, protein: 14, fats: 13, category: 'Mexican' },

  // MIDDLE EASTERN FOODS
  { name: 'Shawarma', units: [{ name: '1 wrap', grams: 200 }, { name: '½ wrap', grams: 100 }, { name: 'grams', grams: 1 }], defaultUnit: '1 wrap', calories: 420, carbs: 35, protein: 28, fats: 18, category: 'Middle Eastern' },
  { name: 'Kebab', aliases: ['shish kebab'], units: [{ name: '1 skewer', grams: 150 }, { name: '2 skewers', grams: 300 }, { name: 'grams', grams: 1 }], defaultUnit: '1 skewer', calories: 280, carbs: 8, protein: 22, fats: 20, category: 'Middle Eastern' },
  { name: 'Pita Bread', units: [{ name: '1 loaf', grams: 60 }, { name: '2 loaves', grams: 120 }, { name: 'grams', grams: 1 }], defaultUnit: '1 loaf', calories: 175, carbs: 35, protein: 6, fats: 1, category: 'Bread' },

  // DRINKS & BEVERAGES (EXPANDED)
  { name: 'Soft Drink', aliases: ['soda', 'cola'], units: [{ name: '1 can', grams: 355 }, { name: '1 bottle', grams: 500 }, { name: '1 glass', grams: 240 }, { name: 'ml', grams: 1 }], defaultUnit: '1 can', calories: 150, carbs: 39, protein: 0, fats: 0, category: 'Beverages' },
  { name: 'Juice', aliases: ['apple juice', 'mango juice'], units: [{ name: '1 glass', grams: 200 }, { name: '1 cup', grams: 240 }, { name: '250 ml', grams: 250 }, { name: 'ml', grams: 1 }], defaultUnit: '1 glass', calories: 107, carbs: 26, protein: 0.5, fats: 0.1, category: 'Beverages' },
  { name: 'Lemonade', units: [{ name: '1 glass', grams: 200 }, { name: '1 cup', grams: 240 }, { name: 'ml', grams: 1 }], defaultUnit: '1 glass', calories: 99, carbs: 26, protein: 0, fats: 0, category: 'Beverages' },
  { name: 'Water', units: [{ name: '1 glass', grams: 200 }, { name: '1 bottle', grams: 500 }, { name: '1 liter', grams: 1000 }, { name: 'ml', grams: 1 }], defaultUnit: '1 glass', calories: 0, carbs: 0, protein: 0, fats: 0, category: 'Beverages' },
  { name: 'Milk Tea', aliases: ['chai latte'], units: [{ name: '1 cup', grams: 240 }, { name: '½ cup', grams: 120 }, { name: 'ml', grams: 1 }], defaultUnit: '1 cup', calories: 150, carbs: 21, protein: 4, fats: 5, category: 'Beverages' },
  { name: 'Protein Shake', units: [{ name: '1 glass', grams: 250 }, { name: '1 cup', grams: 240 }, { name: '500 ml', grams: 500 }, { name: 'ml', grams: 1 }], defaultUnit: '1 glass', calories: 180, carbs: 6, protein: 30, fats: 2, category: 'Beverages' },
  { name: 'Wine', units: [{ name: '1 glass', grams: 150 }, { name: '5 oz', grams: 150 }, { name: '½ bottle', grams: 375 }, { name: 'ml', grams: 1 }], defaultUnit: '1 glass', calories: 120, carbs: 4, protein: 0, fats: 0, category: 'Beverages' },

  // CONDIMENTS & SPREADS
  { name: 'Butter', units: [{ name: '1 tbsp', grams: 14 }, { name: '1 tsp', grams: 5 }, { name: '2 tbsp', grams: 28 }, { name: 'grams', grams: 1 }], defaultUnit: '1 tbsp', calories: 102, carbs: 0.1, protein: 0.1, fats: 11.5, category: 'Condiments' },
  { name: 'Olive Oil', units: [{ name: '1 tbsp', grams: 14 }, { name: '1 tsp', grams: 5 }, { name: 'ml', grams: 1 }], defaultUnit: '1 tbsp', calories: 119, carbs: 0, protein: 0, fats: 13.5, category: 'Condiments' },
  { name: 'Peanut Butter', units: [{ name: '1 tbsp', grams: 16 }, { name: '2 tbsp', grams: 32 }, { name: '1 tsp', grams: 5 }, { name: 'grams', grams: 1 }], defaultUnit: '1 tbsp', calories: 96, carbs: 3, protein: 4, fats: 8, category: 'Condiments' },
  { name: 'Mayonnaise', units: [{ name: '1 tbsp', grams: 15 }, { name: '1 tsp', grams: 5 }, { name: '2 tbsp', grams: 30 }, { name: 'grams', grams: 1 }], defaultUnit: '1 tbsp', calories: 103, carbs: 0, protein: 0, fats: 11.5, category: 'Condiments' },
  { name: 'Ketchup', units: [{ name: '1 tbsp', grams: 17 }, { name: '1 tsp', grams: 6 }, { name: '2 tbsp', grams: 34 }, { name: 'grams', grams: 1 }], defaultUnit: '1 tbsp', calories: 15, carbs: 4, protein: 0, fats: 0, category: 'Condiments' },
  { name: 'Mustard', units: [{ name: '1 tbsp', grams: 10 }, { name: '1 tsp', grams: 3 }, { name: '2 tbsp', grams: 20 }, { name: 'grams', grams: 1 }], defaultUnit: '1 tbsp', calories: 3, carbs: 0, protein: 0, fats: 0, category: 'Condiments' },

  // ADDITIONAL GLOBAL FOODS
  { name: 'Avocado', units: [{ name: '1 whole', grams: 150 }, { name: '½ avocado', grams: 75 }, { name: '1 cup sliced', grams: 150 }, { name: 'grams', grams: 1 }], defaultUnit: '½ avocado', calories: 134, carbs: 7, protein: 1.8, fats: 12, category: 'Fruits' },
  { name: 'Mushroom', units: [{ name: '1 cup', grams: 150 }, { name: '5 mushrooms', grams: 100 }, { name: '½ cup', grams: 75 }, { name: 'grams', grams: 1 }], defaultUnit: '1 cup', calories: 22, carbs: 3, protein: 3, fats: 0.1, category: 'Vegetables' },
  { name: 'Peas', units: [{ name: '1 cup', grams: 160 }, { name: '½ cup', grams: 80 }, { name: '1 serving', grams: 150 }, { name: 'grams', grams: 1 }], defaultUnit: '1 cup', calories: 118, carbs: 21, protein: 8, fats: 0.4, category: 'Vegetables' },
  { name: 'Bell Pepper', units: [{ name: '1 pepper', grams: 150 }, { name: '1 cup chopped', grams: 150 }, { name: '½ pepper', grams: 75 }, { name: 'grams', grams: 1 }], defaultUnit: '1 pepper', calories: 37, carbs: 9, protein: 1.2, fats: 0.3, category: 'Vegetables' },
  { name: 'Garlic', units: [{ name: '1 clove', grams: 3 }, { name: '1 tbsp minced', grams: 9 }, { name: 'grams', grams: 1 }], defaultUnit: '1 clove', calories: 4, carbs: 1, protein: 0.2, fats: 0, category: 'Condiments' },

  // SEAFOOD
  { name: 'Salmon', units: [{ name: '100g', grams: 100 }, { name: '150g', grams: 150 }, { name: '200g', grams: 200 }, { name: 'grams', grams: 1 }], defaultUnit: '150g', calories: 206, carbs: 0, protein: 22, fats: 12.3, category: 'Protein' },
  { name: 'Shrimp', units: [{ name: '100g', grams: 100 }, { name: '150g', grams: 150 }, { name: '10 shrimp', grams: 100 }, { name: 'grams', grams: 1 }], defaultUnit: '100g', calories: 99, carbs: 0.2, protein: 24, fats: 0.3, category: 'Protein' },
  { name: 'Tuna', units: [{ name: '100g', grams: 100 }, { name: '1 can', grams: 142 }, { name: '150g', grams: 150 }, { name: 'grams', grams: 1 }], defaultUnit: '100g', calories: 144, carbs: 0, protein: 30, fats: 1.3, category: 'Protein' },

  // PASTA & NOODLES
  { name: 'Brown Pasta', units: [{ name: '1 cup cooked', grams: 140 }, { name: '1 serving', grams: 150 }, { name: '½ cup cooked', grams: 70 }, { name: 'grams', grams: 1 }], defaultUnit: '1 cup cooked', calories: 166, carbs: 35, protein: 6, fats: 0.8, category: 'International' },
  { name: 'Noodles', aliases: ['instant noodles'], units: [{ name: '1 pack', grams: 80 }, { name: '1 serving', grams: 100 }, { name: '½ pack', grams: 40 }, { name: 'grams', grams: 1 }], defaultUnit: '1 pack', calories: 271, carbs: 51, protein: 8, fats: 2.5, category: 'International' },

  // NUTS & SEEDS
  { name: 'Walnuts', units: [{ name: '1 handful', grams: 30 }, { name: '7 halves', grams: 14 }, { name: '1 oz', grams: 28 }, { name: 'grams', grams: 1 }], defaultUnit: '1 handful', calories: 185, carbs: 4, protein: 4.3, fats: 18.5, category: 'Snacks' },
  { name: 'Sunflower Seeds', units: [{ name: '1 handful', grams: 30 }, { name: '¼ cup', grams: 35 }, { name: '1 oz', grams: 28 }, { name: 'grams', grams: 1 }], defaultUnit: '1 handful', calories: 153, carbs: 6, protein: 6, fats: 13, category: 'Snacks' },

  // LEPRECHAUN AND CEREAL MILK
  { name: 'Leprechaun Cereal', aliases: ['magical cereal', 'rainbow cereal', 'lucky charms'], units: [{ name: '1 cup', grams: 40 }, { name: '½ cup', grams: 20 }, { name: '2 cups', grams: 80 }, { name: 'grams', grams: 1 }], defaultUnit: '1 cup', calories: 150, carbs: 33, protein: 3, fats: 1.5, category: 'Breakfast' },
  { name: 'Cereal Milk', aliases: ['milk after cereal', 'cereal milk sweetened'], units: [{ name: '1 cup', grams: 200 }, { name: '½ cup', grams: 100 }, { name: '¼ cup', grams: 50 }, { name: 'ml', grams: 1 }], defaultUnit: '1 cup', calories: 150, carbs: 12, protein: 8, fats: 8, category: 'Beverages' },
  { name: 'Leprechaun Trap', aliases: ['rainbow bait', 'lucky trap'], units: [{ name: '1 trap', grams: 100 }, { name: '½ trap', grams: 50 }, { name: '2 traps', grams: 200 }, { name: 'grams', grams: 1 }], defaultUnit: '1 trap', calories: 200, carbs: 40, protein: 2, fats: 3, category: 'Snacks' },
];

export const FOOD_CATEGORIES = ['Indian Bread', 'Grains', 'Curries', 'Indian Breakfast', 'Street Food', 'Vegetables', 'Fruits', 'Protein', 'Dairy', 'Beverages', 'Fast Food', 'International', 'Snacks', 'Diet Food', 'Breakfast', 'Desserts', 'Asian', 'Mediterranean', 'American', 'Mexican', 'Middle Eastern', 'Bread', 'Condiments'];

export const getDefaultUnit = (foodName: string): string => {
  const food = FOOD_DATABASE.find(f => f.name.toLowerCase() === foodName.toLowerCase());
  return food?.defaultUnit || 'grams';
};

export const getAllUnits = (foodName: string): string[] => {
  const food = FOOD_DATABASE.find(f => f.name.toLowerCase() === foodName.toLowerCase());
  return food?.units.map(u => u.name) || ['grams'];
};

export const searchFoods = (query: string): FoodItem[] => {
  if (!query.trim()) return [];
  const lowerQuery = query.toLowerCase();
  return FOOD_DATABASE.filter(food =>
    food.name.toLowerCase().includes(lowerQuery) ||
    food.aliases?.some(alias => alias.includes(lowerQuery)) ||
    food.category.toLowerCase().includes(lowerQuery)
  ).slice(0, 10);
};

export const getFoodNutrition = (foodName: string, quantity: number, unit: string): { calories: number; carbs: number; protein: number; fats: number } => {
  const food = FOOD_DATABASE.find(f => f.name.toLowerCase() === foodName.toLowerCase());
  if (!food) return { calories: 0, carbs: 0, protein: 0, fats: 0 };
  const unitEntry = food.units.find(u => u.name.toLowerCase() === unit.toLowerCase());
  const gramsEquivalent = unitEntry?.grams || 100;
  const totalGrams = quantity * gramsEquivalent;
  const multiplier = totalGrams / 100;
  return {
    calories: Math.round(food.calories * multiplier),
    carbs: Math.round(food.carbs * multiplier * 10) / 10,
    protein: Math.round(food.protein * multiplier * 10) / 10,
    fats: Math.round(food.fats * multiplier * 10) / 10,
  };
};

export const mockAIFoodRecognition = (imageData: string): Promise<{ foods: Array<{ name: string; confidence: number; quantity?: number; unit?: string }>, mealType?: string }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const randomMeals = [
        { name: 'Chapati', confidence: 0.89, quantity: 2, unit: '1 full chapati' },
        { name: 'Rice (Cooked)', confidence: 0.86, quantity: 1, unit: '1 serving' },
        { name: 'Dal Tadka', confidence: 0.92, quantity: 1, unit: '1 serving' },
      ];
      const randomMeal = randomMeals[Math.floor(Math.random() * randomMeals.length)];
      resolve({ foods: [randomMeal], mealType: 'meal' });
    }, 1200);
  });
};
