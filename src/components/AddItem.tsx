import { useContext, useState } from "react";
import { LangContext } from "../context/LangContext";
import { mealHandler } from "../services/mealHandler";
import { drinkHandler } from "../services/drinkHandler";
import { Button, ButtonGroup, Container, TextField } from "@mui/material";
import type { Drink } from "../interfaces/Drink";
import type { Meal } from "../interfaces/Meal";

export default function AddItem() {
    const { texts } = useContext(LangContext)
    const t = (key: string) => texts?.[key ?? key]
    const defaultMeal = mealHandler.createDefault()
    const [newItem, setNewitem] = useState<Meal | Drink>(defaultMeal)
    // true = meal, false = drink
    const [itemSwitch, setItemSwitch] = useState<boolean>(true)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewitem({...newItem, [e.target.name]: e.target.value})
    }

    const handleTypeChange = () => {
        
        // 'as X' is not needed, only added for reading clarity. Doesnt affect TS check or runtime
        if (mealHandler.isMeal(newItem)) {
            const { weightInGrams: _, ...transItem } = newItem
            setNewitem({...transItem, volumeInl: 0} as Drink)
            setItemSwitch(!itemSwitch)
        }
        else {
            const {volumeInl: _, ...transItem} = newItem
            setNewitem({...transItem, weightInGrams: 0} as Meal)
            setItemSwitch(!itemSwitch)
        }
    }

    const handleSave = () => {
        mealHandler.isMeal(newItem) ? mealHandler.add(newItem) : drinkHandler.add(newItem)
        .then(() => console.log("Todo navi ym."))
        .catch((err) => console.log(err))
    }

    if (!texts) return <p>Loading...</p>

    return (
        <Container>
            <ButtonGroup variant="contained">
                <Button disabled={!itemSwitch} onClick={handleTypeChange}>
                    TODO! Juoma
                </Button>
                <Button disabled={itemSwitch} onClick={handleTypeChange}>
                    TODO! Ruoka
                </Button>
            </ButtonGroup>
            <TextField
                name="name"
                value={newItem.name}
                label={t("addItem.name")}
                onChange={handleChange}
            />
            <TextField
                name="kcal"
                value={newItem.kcal}
                label={t("addItem.kcal")}
                onChange={handleChange}
            />
            <TextField
                name="fat"
                value={newItem.fat}
                label={t("addItem.fat")}
                onChange={handleChange}
            />
            <TextField
                name="hardFat"
                value={newItem.hardFat}
                label={t("addItem.hardFat")}
                onChange={handleChange}
            />
            <TextField
                name="carbs"
                value={newItem.carbs}
                label={t("addItem.carbs")}
                onChange={handleChange}
            />
            <TextField
                name="sugar"
                value={newItem.sugar}
                label={t("addItem.sugar")}
                onChange={handleChange}
            />
            <TextField
                name="protein"
                value={newItem.protein}
                label={t("addItem.protein")}
                onChange={handleChange}
            />
            <TextField
                name="salt"
                value={newItem.salt}
                label={t("addItem.salt")}
                onChange={handleChange}
            />
            {mealHandler.isMeal(newItem) ? 
            <TextField
                name="weightInGrams"
                value={newItem.weightInGrams}
                label={t("addItem.weightInGrams")}
                onChange={handleChange}
            />
            :
            <TextField
                name="volumeInl"
                value={newItem.volumeInl}
                label={t("addItem.volumeInl")}
                onChange={handleChange}
            />
            }
            <ButtonGroup variant="contained">
                <Button onClick={handleSave} color="success">
                    {t("common.save")}
                </Button>
                <Button onClick={() => console.log(newItem)} color="error">
                    {t("common.cancel")}
                </Button>
            </ButtonGroup>

        </Container>
    )
}