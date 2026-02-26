

export interface Macros {
    protein: number
    carbs: number
    sugar: number
    fat: number
    hardFat: number
    kcal: number
    salt: number
}

export type MacroKeys = keyof Macros