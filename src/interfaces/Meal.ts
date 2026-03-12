import type { Macros } from "./Nutrition"

//Snacks and ready meals, macros per 100g
export interface Meal {
    id: string
    name: string
    amount: number
    kcal: number
    fat: number
    hardFat: number
    carbs: number
    sugar: number
    protein: number
    salt: number
    weightInGrams: number
    totalMacros: Macros
}