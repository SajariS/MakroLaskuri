import type { Macros } from "./Nutrition"

// Macros per 100ml
export interface Drink {
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
    volumeInl: number
    totalMacros: Macros
}