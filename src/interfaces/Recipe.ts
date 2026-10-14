import type { Macros } from "./Nutrition"

export interface RecipeIngredient {
    foodItemId: string
    amount: number
    type: 'meal' | 'drink'
}

export interface Recipe {
    id: string
    name: string
    ingredients: RecipeIngredient[]
    foodItemId: string
    servings: number
    description?: string
    totalMacros: Macros

}