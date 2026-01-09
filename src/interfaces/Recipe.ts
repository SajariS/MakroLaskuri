import type { Ingredient } from "./Ingredient"

export interface RecipeIngredient {
    ingredient: Ingredient
    grams: number
}

export interface Recipe {
    id: string
    name: string
    ingredients: RecipeIngredient[]
    description?: string 
}