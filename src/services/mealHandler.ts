import { nanoid } from "nanoid"
import type { Meal } from "../interfaces/Meal"


const MEAL_KEY = 'meal'

const loadMeals = (): Meal[] => {
    const stored = localStorage.getItem(MEAL_KEY)
    if (!stored) return []

    try {
        return JSON.parse(stored) as Meal[]
    }
    catch {
        return []
    }
}

const saveMeals = (meals: Meal[]) => {
    localStorage.setItem(MEAL_KEY, JSON.stringify(meals))
}

export const mealHandler = {

    createDefault(): Meal {
        return({
            id: nanoid(),
            name: '',
            kcal: 0,
            weightInGrams: 0,
            fat: 0,
            hardFat: 0,
            carbs: 0,
            sugar: 0,
            protein: 0,
            salt: 0,
            totalMacros: {
                fat: 0,
                hardFat: 0,
                carbs: 0,
                sugar: 0,
                protein: 0,
                salt: 0,
                kcal: 0,
            }
        })
    },

    isMeal(obj: unknown): obj is Meal {
        if (typeof obj !== "object" || obj === null) return false

        const referenceKeys = Object.keys(this.createDefault()).sort()
        const objKeys = Object.keys(obj).sort()

        return(
            referenceKeys.length === objKeys.length &&
            referenceKeys.every((key, i) => key === objKeys[i])
        )
    },

    async getAll(): Promise<Meal[]> {
        return loadMeals()
    },

    async getById(id: string): Promise<Meal | undefined> {
        return loadMeals().find((meal) => meal.id === id)
    },

    async add(meal: Meal): Promise<void> {
        const meals = loadMeals()
        saveMeals([...meals, meal])
        return
    },

    async update(updatedMeal: Meal): Promise<void> {
        const meals = loadMeals()
        const updatedMeals = meals.map((meal) => meal.id === updatedMeal.id ? updatedMeal : meal)
        saveMeals(updatedMeals)
        return
    },

    async delete(id: string): Promise<void> {
        const meals = loadMeals()
        saveMeals(meals.filter((meal) => meal.id !== id))
        return
    },
}