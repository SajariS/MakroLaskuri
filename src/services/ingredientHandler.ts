import { nanoid } from "nanoid";
import type { Ingredient } from "../interfaces/Ingredient";

const INGREDIENT_KEY = 'ingredient'

const loadIngredients = (): Ingredient[] => {
    const stored = localStorage.getItem(INGREDIENT_KEY)
    if (!stored) return []

    try {
        return JSON.parse(stored) as Ingredient[]
    }
    catch {
        return []
    }
}

const saveIngredients = (ingredients: Ingredient[]) => {
    localStorage.setItem(INGREDIENT_KEY, JSON.stringify(ingredients))
} 

export const ingredientHandler = {

    createDefault(): Ingredient {
        return({
            id: nanoid(),
            name: '',
            protein: 0,
            carbs: 0,
            fat: 0,
            kiloCalories: 0
        })
    },

    async getAll(): Promise<Ingredient[]> {
        return loadIngredients()
    },

    async getById(id: string): Promise<Ingredient | undefined> {
        return loadIngredients().find((ingredient) => ingredient.id === id)
    },

    async add(ingredient: Ingredient): Promise<void> {
        const ingredients = loadIngredients()
        saveIngredients([...ingredients, ingredient])
        return
    },

    async update(updatedIngredient: Ingredient): Promise<void> {
        const ingredients = loadIngredients()
        const updatedIngredients = ingredients.map((ingredient) => 
            ingredient.id === updatedIngredient.id ? updatedIngredient : ingredient
        )
        saveIngredients(updatedIngredients)
    },

    async delete(id: string): Promise<void> {
        const ingredients = loadIngredients()
        saveIngredients(ingredients.filter((ingredient) => ingredient.id !== id))
        return
    },
}
