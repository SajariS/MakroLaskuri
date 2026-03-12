import type { Drink } from "../interfaces/Drink";
import type { Meal } from "../interfaces/Meal";
import type { Macros } from "../interfaces/Nutrition";
import { drinkHandler } from "./drinkHandler";

export function macroSum(foodObj: Meal | Drink): Macros {
  const factor = drinkHandler.isDrink(foodObj)
    ? foodObj.volumeInl * 10
    : foodObj.weightInGrams / 100;

  return {
    protein: foodObj.protein * factor,
    carbs: foodObj.carbs * factor,
    sugar: foodObj.sugar * factor,
    fat: foodObj.fat * factor,
    hardFat: foodObj.hardFat * factor,
    kcal: foodObj.kcal * factor,
    salt: foodObj.salt * factor,
  };
}

export function macroMultiply(foodObj: Meal | Drink): Macros {
  const multiplier = foodObj.amount;
  const macros = macroSum(foodObj);

  for (const key in macros) {
    macros[key as keyof Macros] = macros[key as keyof Macros] * multiplier;
  }

  return macros;
}

type MassUnit = "mg" | "g" | "kg"
type VolumeUnit = "ml" | "dl" | "l"
export type Unit = MassUnit | VolumeUnit

export function handleConversion(value: number, from: Unit, to: Unit) {
  const base = (() => {
    switch (from) {
      case "mg":
        return value / 1000;
      case "g":
        return value;
      case "kg":
        return value * 1000;
      case "ml":
        return value / 1000;
      case "dl":
        return value / 10;
      case "l":
        return value;
    }
  })();

  switch (to) {
    case "mg":
      return base * 1000;
    case "g":
      return base;
    case "kg":
      return base / 1000;
    case "ml":
      return base * 1000;
    case "dl":
      return base * 10;
    case "l":
      return base;
  }
}