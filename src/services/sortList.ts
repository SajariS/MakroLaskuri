import type { Drink } from "../interfaces/Drink"
import type { Meal } from "../interfaces/Meal"

export type FoodItem = Meal | Drink
export type FoodItemKey = keyof FoodItem

  //Avain oliosta jolla sortataan ja normaali(true)/käänteinen(false) sort
export function sortList(list: FoodItem[], key: FoodItemKey, direction: boolean) {
    if (list[0][key] !== null && Number.isNaN(list[0][key])) {
        return list.sort((a, b) => {
            if (String(a[key]).toUpperCase() > String(b[key]).toUpperCase()) return direction ? -1 : 1
            if (String(a[key]).toUpperCase() < String(b[key]).toUpperCase()) return direction ? 1 : -1
            return 0
        })
    }
    else if (list[0][key] !== null) {
        return list.sort((a, b) => Number(a[key]) - Number(b[key]))
    }
}