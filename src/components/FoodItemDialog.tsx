import { useMemo, useState } from "react"
import type { Drink } from "../interfaces/Drink"
import type { FoodItem, FoodItemKey } from "../interfaces/FoodItem"
import type { Meal } from "../interfaces/Meal"
import { mealHandler } from "../services/mealHandler"

type FoodItemDialogProps = {
    onClose: () => void
    initialData?: Partial<FoodItem>
    onSave: (item: FoodItem) => void
}

type StepConfig = {
    key: FoodItemKey
    label: string
    helper?: string
    type?: "text" | "number"
    variant?: "toggle"
    visibleFor?: "all" | "meal" | "drink"
}

type ItemSwitch = "food" | "drink"

export default function FoodItemDialog({ initialData, onClose, onSave }: FoodItemDialogProps) {
    const defaultMeal = mealHandler.createDefault()
    const [form, setForm] = useState<Meal | Drink>(() => ({
        ...defaultMeal,
        ...initialData
    }))
    const [modeSwitch, setModeSwtich] = useState<Boolean>(true)
    const [itemType, setItemType] = useState<ItemSwitch>("food")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const sourceSteps: StepConfig[] = [
        {
            key: "name",
            label: "TODO! Nimi",
            type: "text"
        }
    ]

    const getFilteredSteps = (steps: StepConfig[], itemType: ItemSwitch) => {
        return steps.filter((step) => {
            if (!step.visibleFor || step.visibleFor === "all") return true
            return step.visibleFor === itemType
        })
    }

    const steps = useMemo(
        () => getFilteredSteps(sourceSteps, itemType), [itemType]
    )
}