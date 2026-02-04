import type { Drink } from "./Drink"
import type { Meal } from "./Meal"
import type { Macros } from "./Nutrition"
import type { Recipe } from "./Recipe"

// snippets for days of week, actual text will be fetched by provider.
type Weekday = "ma" | "ti" | "ke" | "to" | "pe" | "la" | "su"

// Mix of items consumed in a day, all items share/will share unified Macro param for calculations.
type FoodItem = Meal | Drink 

// Describes daily limit, over/under/equal to threshold 
type ConstraintType = "<" | ">" | "="

export interface Day {
    weekday: Weekday
    totalMacros: Macros | null
    macroLimits: Macros | null
    meals: FoodItem[]
    proteinLimit?: ConstraintType | null
    carbsLimit?: ConstraintType | null
    sugarLimit?: ConstraintType | null
    fatLimit?: ConstraintType | null
    hardFatLimit?: ConstraintType | null
    kcalLimit?: ConstraintType | null
    saltLimit?: ConstraintType | null
}