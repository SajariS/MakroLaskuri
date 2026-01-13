import { nanoid } from "nanoid"
import type { Drink } from "../interfaces/Drink"


const DRINK_KEY = 'drink'

const loadDrinks = (): Drink[] => {
    const stored = localStorage.getItem(DRINK_KEY)
    if (!stored) return []

    try {
        return JSON.parse(stored) as Drink[]
    }
    catch {
        return []
    }
}

const saveDrinks = (drinks: Drink []) => {
    localStorage.setItem(DRINK_KEY, JSON.stringify(drinks))
}


export const drinkHandler = {

    createDefault(): Drink {
        return ({
            id: nanoid(),
            name: '',
            kcal: 0,
            fat: 0,
            hardFat: 0,
            carbs: 0,
            sugar: 0,
            protein: 0,
            salt: 0,
            volumeInl: 0,
            totalMacros: null
        })
    },

    isDrink(obj: unknown): obj is Drink {
        if (typeof obj !== "object" || obj === null) return false

        const referenceKeys = Object.keys(this.createDefault()).sort()
        const objKeys = Object.keys(obj).sort()

        return(
            referenceKeys.length === objKeys.length &&
            referenceKeys.every((key, i) => key === objKeys[i])
        )
    },

    async getAll(): Promise<Drink[]> {
        return loadDrinks()
    },

    async getById(id: string): Promise<Drink | undefined> {
        return loadDrinks().find((drink) => drink.id === id)
    },

    async add(drink: Drink): Promise<void> {
        const drinks = loadDrinks()
        saveDrinks([...drinks, drink])
        return
    },

    async update(updatedDrink: Drink): Promise<void> {
        const drinks = loadDrinks()
        const updatedDrinks = drinks.map((drink) => 
            drink.id === updatedDrink.id ? updatedDrink : drink
        )
        saveDrinks(updatedDrinks)
        return
    },

    async delete(id: string): Promise<void> {
        const drinks = loadDrinks()
        saveDrinks(drinks.filter((drink) => drink.id !== id))
        return
    },
}