export type Cuisine = 'All Cuisines' | 'Japanese' | 'Western' | 'Chinese';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface RecipeIngredient {
  name: string;
  amount?: string;
  notes?: string;
}

export interface Recipe {
  id: string;
  name: string;
  cuisine: 'Japanese' | 'Western' | 'Chinese';
  requiredIngredients: string[];
  ingredientDetails?: RecipeIngredient[];
  prepTime: string;
  cookTime: string;
  servings: number;
  difficulty: Difficulty;
  calories?: number;
  description: string;
  instructions: string[];
  imageUrl?: string;
  dietary?: string[];
  chefTip?: string;
}

export interface MatchResult {
  recipe: Recipe;
  matchPercentage: number;
  matchedIngredients: string[];
  missingIngredients: string[];
  isCookableNow: boolean;
}

export interface IngredientCategory {
  name: string;
  iconName: string;
  items: string[];
}
