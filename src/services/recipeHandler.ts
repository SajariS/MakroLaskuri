import { nanoid } from "nanoid"
import type { Recipe } from "../interfaces/Recipe"


const RECIPE_KEY = "recipe"

const loadRecipes = (): Recipe[] => {
    const stored = localStorage.getItem(RECIPE_KEY)
    if (!stored) return []

    try {
        return JSON.parse(stored) as Recipe[]
    }
    catch {
        return []
    }
}

const saveRecipes = (recipes: Recipe[]) => {
    localStorage.setItem(RECIPE_KEY, JSON.stringify(recipes))
}

export const recipeHandler = {

    createDefault(): Recipe {
        return({
            id: nanoid(),
            name: '',
            ingredients: [],
            description: ''
        })
    },

    async getAll(): Promise<Recipe[]> {
        return loadRecipes()
    },

    async getById(id: string): Promise<Recipe | undefined> {
        return loadRecipes().find((recipe) => recipe.id === id)
    },

    async add(recipe: Recipe): Promise<void> {
        const recipes = loadRecipes()
        saveRecipes([...recipes, recipe])
        return
    },

    async update(updatedRecipe: Recipe): Promise<void> {
        const recipes = loadRecipes()
        const updatedRecipes = recipes.map((recipe) =>
            recipe.id === updatedRecipe.id ? updatedRecipe : recipe
        )
        saveRecipes(updatedRecipes)
        return
    },

    async delete(id: string): Promise<void> {
        const recipes = loadRecipes()
        saveRecipes(recipes.filter((recipe) => recipe.id !== id))
        return
    },
}