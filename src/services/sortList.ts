import type { FoodItem, FoodItemKey } from "../interfaces/FoodItem"


  //Avain oliosta jolla sortataan ja normaali(true)/käänteinen(false) sort
export function sortList(list: FoodItem[], key: FoodItemKey, direction: boolean) {
    const isNonNumberic = (value: unknown): boolean => {
        return typeof value !== "number"
    }
    console.log("Recieved inversion: " + direction)
    if (list[0][key] !== null && Number.isNaN(Number(list[0][key]))) {
        console.log("TEsti")
        return list.sort((a, b) => {
            /*if (String(a[key]).toUpperCase() > String(b[key]).toUpperCase()) return direction ? -1 : 1
            if (String(a[key]).toUpperCase() > String(b[key]).toUpperCase()) return direction ? 1 : -1
            return 0 */
            if (direction) {
                console.log(String(a[key]).toUpperCase() + String(b[key]).toUpperCase())
                return String(a[key]).toUpperCase() > String(b[key]).toUpperCase() ? -1 : 1
            }
            else {
                return String(a[key]).toUpperCase() > String(b[key]).toUpperCase() ? 1 : -1
            }
        })
    }
    else if (list[0][key] !== null) {
        return list.sort((a, b) => (direction ? Number(a[key]) - Number(b[key]) : Number(b[key]) - Number(a[key])))
    }
}