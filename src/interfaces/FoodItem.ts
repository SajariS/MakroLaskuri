import type { Drink } from "./Drink"
import type { Meal } from "./Meal"
import type { NumberKeys } from "./Validation"


export type FoodItem = Meal | Drink
export type FoodItemKey = keyof FoodItem
export type FoodItemNumberKey = NumberKeys<FoodItem>