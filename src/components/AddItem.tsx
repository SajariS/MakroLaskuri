import { useContext, useState } from "react";
import { LangContext } from "../context/LangContext";
import { mealHandler } from "../services/mealHandler";
import { drinkHandler } from "../services/drinkHandler";
import { Box, Button, ButtonGroup, Container, TextField, Typography } from "@mui/material";
import type { Drink } from "../interfaces/Drink";
import type { Meal } from "../interfaces/Meal";
import NumberSpinner from "./NumberSpinner";
import type { FoodItem, FoodItemKey, FoodItemNumberKey } from "../interfaces/FoodItem";
import { NumberField } from "@base-ui/react";
import { macroSum } from "../services/calculations";

type AddItemProps = {
    setToggle: (state: boolean) => void
    handleAdd: (item: FoodItem) => void
}

const renderKeys = ['kcal', 'fat', 'hardFat', 'carbs', 'sugar', 'protein', 'salt']

export default function AddItem({ setToggle, handleAdd }: AddItemProps) {
    const { texts } = useContext(LangContext)
    const t = (key: string) => texts?.[key ?? key]
    const defaultMeal = mealHandler.createDefault()
    const [newItem, setNewitem] = useState<Meal | Drink>(defaultMeal)
    // true = meal, false = drink
    const [itemSwitch, setItemSwitch] = useState<boolean>(true)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewitem({...newItem, [e.target.name]: e.target.value})
    }

    const handleSpinnerChange = (key: FoodItemKey, value: number) => {
        setNewitem({...newItem, [key]: value})
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

    // Todo! Lisää totalMacros lasku ennen tallennusta
    const handleSave = () => {
        const macros = macroSum(newItem)
        handleAdd({...newItem, totalMacros: macros})
        setToggle(false)
    }

    const handleCancel = () => {
        setToggle(false)
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
            {Object.entries(newItem).filter(([key]) => renderKeys.includes(key)).map(([key, _value]) => (
                    <Box key={key}>
                        <Typography>{t(`macros.${key}`)}</Typography>
                        <NumberSpinner 
                            name={key}
                            min={0}
                            value={newItem[key as FoodItemNumberKey]}
                            onValueChange={(value) => handleSpinnerChange(key as FoodItemKey, value ?? 0)}
                        />
                    </Box>
            ))}

            {mealHandler.isMeal(newItem) ? 
            <Box>
                <Typography>{t("addItem.weightInGrams")}</Typography>
                <NumberSpinner 
                    name="weightInGrams"
                    value={newItem.weightInGrams}
                    onValueChange={(value) => handleSpinnerChange("weightInGrams" as keyof FoodItem, value ?? 0)}
                />
            </Box>
            :
            <Box>
                <Typography>{t("addItem.volumeInl")}</Typography>
                <NumberSpinner 
                    name="volumeInl"
                    value={newItem.volumeInl}
                    onValueChange={(value) => handleSpinnerChange("volumeInl" as keyof FoodItem, value ?? 0)}
                />
            </Box>            
            }
            <ButtonGroup variant="contained">
                <Button onClick={handleSave} color="success">
                    {t("common.save")}
                </Button>
                <Button onClick={handleCancel} color="error">
                    {t("common.cancel")}
                </Button>
            </ButtonGroup>

        </Container>
    )
}