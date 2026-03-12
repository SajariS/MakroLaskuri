import type { Drink } from "./Drink"
import type { Meal } from "./Meal"
import type { Macros } from "./Nutrition"

// snippets for days of week, actual text will be fetched by provider.
type Weekday = "ma" | "ti" | "ke" | "to" | "pe" | "la" | "su"

// Mix of items consumed in a day, all items share/will share unified Macro param for calculations.
type FoodItem = Meal | Drink 

// Describes daily limit, over/under/equal to threshold 
// type ConstraintType = "<" | ">" | "="

export interface Day {
    weekday: Weekday
    totalMacros: Macros
    macroLimits: Macros
    meals: FoodItem[]
    proteinLimit: boolean
    carbsLimit: boolean
    sugarLimit: boolean
    fatLimit: boolean
    hardFatLimit: boolean
    kcalLimit: boolean
    saltLimit: boolean
}