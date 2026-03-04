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

type MassUnit = "mg" | "g" | "kg"
type VolumeUnit = "ml" | "dl" | "l"
type Unit = MassUnit | VolumeUnit

const renderKeys = ['kcal', 'fat', 'hardFat', 'carbs', 'sugar', 'protein', 'salt']

export default function AddItem({ setToggle, handleAdd }: AddItemProps) {
    const { texts } = useContext(LangContext)
    const t = (key: string) => texts?.[key ?? key]
    const defaultMeal = mealHandler.createDefault()
    const [newItem, setNewitem] = useState<Meal | Drink>(defaultMeal)
    // true = meal, false = drink
    const [itemSwitch, setItemSwitch] = useState<boolean>(true)
    const [unit, setUnit] = useState<Unit>(itemSwitch ? 'g' : 'l')

    const handleConversion = (value: number, from: Unit, to: Unit) => {
        const base = (() => {
            switch (from) {
                case "mg":
                    return value / 1000
                case "g":
                    return value
                case "kg":
                    return value * 1000
                case "ml":
                    return value / 1000
                case "dl":
                    return value / 10
                case "l":
                    return value
            }
        })()

        switch (to) {
            case "mg":
                return base * 1000
            case "g":
                return base
            case "kg":
                return base / 1000
            case "ml":
                return base * 1000
            case "dl":
                return base * 10
            case "l":
                return base
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewitem({...newItem, [e.target.name]: e.target.value})
    }

    const handleSpinnerChange = (key: FoodItemKey, value: number) => {
        setNewitem({...newItem, [key]: value})
    }

    const handleMeasureSpinner = (key: FoodItemKey, value: number) => {
        const convertedValue = itemSwitch ? handleConversion(value, unit, "g") : handleConversion(value, unit, 'l')
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

    // Käytetään tilavuus/massa renderissä jotta se on erillään ns "oikeasta" arvosta ilman muunnoksia
    const displayValue = mealHandler.isMeal(newItem) ?
        handleConversion(newItem.weightInGrams, "g", unit) :
        handleConversion(newItem.volumeInl, 'l', unit)

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
                    value={displayValue}
                    onValueChange={(value) => handleMeasureSpinner("weightInGrams" as keyof FoodItem, value ?? 0)}
                />
            </Box>
            :
            <Box>
                <Typography>{t("addItem.volumeInl")}</Typography>
                <NumberSpinner 
                    name="volumeInl"
                    value={displayValue}
                    onValueChange={(value) => handleMeasureSpinner("volumeInl" as keyof FoodItem, value ?? 0)}
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