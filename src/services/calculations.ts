import type { Drink } from "../interfaces/Drink";
import type { Meal } from "../interfaces/Meal";
import { drinkHandler } from "./drinkHandler";
import { mealHandler } from "./mealHandler";


export function macroSum(foodObj: Meal | Drink): Meal | Drink {
    
    const factor = drinkHandler.isDrink(foodObj) ? foodObj.volumeInl * 10 : foodObj.weightInGrams / 100
    
    const updatedObj = {...foodObj,
        kcalSum: foodObj.kcal * factor,
        fat: foodObj.fat * factor,
        hardFat: foodObj.hardFat * factor,
        carbs: foodObj.carbs * factor,
        sugar: foodObj.sugar * factor,
        protein: foodObj.protein * factor,
        salt: foodObj.salt * factor
    }

    return updatedObj

}