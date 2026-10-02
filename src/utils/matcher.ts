import { MatchResult, Recipe } from '../types/recipe';

/**
 * Normalizes an ingredient name for fuzzy and stem-friendly matching.
 * e.g., "Eggs" -> "egg", "Potatoes" -> "potato", "Chicken Thighs" -> "chicken"
 */
export function normalizeIngredient(name: string): string {
  if (!name) return '';
  let str = name.toLowerCase().trim();

  // Remove common plurals and suffixes
  if (str.endsWith('ies')) {
    str = str.slice(0, -3) + 'y';
  } else if (str.endsWith('es') && !str.endsWith('ses')) {
    str = str.slice(0, -2);
  } else if (str.endsWith('s') && !str.endsWith('ss')) {
    str = str.slice(0, -1);
  }

  return str;
}

/**
 * Checks whether user pantry contains the required ingredient.
 * Handles exact match, normalized match, and substring containment
 * (e.g., pantry has "Chicken Breast" and recipe requires "Chicken", or vice versa).
 */
export function isIngredientInPantry(
  requiredIngredient: string,
  userPantry: string[]
): boolean {
  const normRequired = normalizeIngredient(requiredIngredient);
  const rawRequired = requiredIngredient.toLowerCase().trim();

  return userPantry.some((userItem) => {
    const normUser = normalizeIngredient(userItem);
    const rawUser = userItem.toLowerCase().trim();

    if (rawRequired === rawUser || normRequired === normUser) {
      return true;
    }

    // Substring checks (e.g., "olive oil" matches "oil", "soy sauce" matches "soy")
    if (rawUser.includes(rawRequired) || rawRequired.includes(rawUser)) {
      return true;
    }

    if (normUser.includes(normRequired) || normRequired.includes(normUser)) {
      return true;
    }

    return false;
  });
}

/**
 * Evaluates a single recipe against the user's pantry.
 */
export function calculateRecipeMatch(
  recipe: Recipe,
  userPantry: string[]
): MatchResult {
  if (!recipe.requiredIngredients || recipe.requiredIngredients.length === 0) {
    return {
      recipe,
      matchPercentage: 100,
      matchedIngredients: [],
      missingIngredients: [],
      isCookableNow: true,
    };
  }

  const matchedIngredients: string[] = [];
  const missingIngredients: string[] = [];

  recipe.requiredIngredients.forEach((req) => {
    if (isIngredientInPantry(req, userPantry)) {
      matchedIngredients.push(req);
    } else {
      missingIngredients.push(req);
    }
  });

  const total = recipe.requiredIngredients.length;
  const matchPercentage = Math.round((matchedIngredients.length / total) * 100);

  return {
    recipe,
    matchPercentage,
    matchedIngredients,
    missingIngredients,
    isCookableNow: matchPercentage === 100,
  };
}

/**
 * Matches and ranks all recipes given a user pantry and selected cuisine.
 * Sorts primarily by match percentage descending, then by cookable status, then by recipe name.
 */
export function getRankedRecipes(
  recipes: Recipe[],
  userPantry: string[],
  selectedCuisine: string
): MatchResult[] {
  const filtered =
    selectedCuisine === 'All Cuisines'
      ? recipes
      : recipes.filter((r) => r.cuisine === selectedCuisine);

  const matched = filtered.map((recipe) =>
    calculateRecipeMatch(recipe, userPantry)
  );

  return matched.sort((a, b) => {
    if (b.matchPercentage !== a.matchPercentage) {
      return b.matchPercentage - a.matchPercentage;
    }
    // Tie breaker: recipes needing fewer missing ingredients
    if (a.missingIngredients.length !== b.missingIngredients.length) {
      return a.missingIngredients.length - b.missingIngredients.length;
    }
    return a.recipe.name.localeCompare(b.recipe.name);
  });
}
