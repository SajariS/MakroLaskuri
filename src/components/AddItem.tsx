import { useContext, useState } from "react";
import { LangContext } from "../context/LangContext";
import { mealHandler } from "../services/mealHandler";
import { drinkHandler } from "../services/drinkHandler";
import { Box, Button, ButtonGroup, Container, Grid, Paper, TextField, Typography } from "@mui/material";
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

export default function AddItem({ setToggle, handleAdd }: AddItemProps) {
    const { texts } = useContext(LangContext)
    const t = (key: string) => texts?.[key ?? key]
    const defaultMeal = mealHandler.createDefault()
    const [newItem, setNewitem] = useState<Meal | Drink>(defaultMeal)
    // true = meal, false = drink
    const [itemSwitch, setItemSwitch] = useState<boolean>(true)
    const [unit, setUnit] = useState<Unit>(itemSwitch ? 'g' : 'l')
    const renderKeys: FoodItemNumberKey[] = ["kcal", "protein", "carbs", "sugar", "fat", "hardFat", "salt"]

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
        setNewitem({ ...newItem, [e.target.name]: e.target.value })
    }

    const handleSpinnerChange = (key: FoodItemKey, value: number) => {
        setNewitem({ ...newItem, [key]: value })
    }

    const handleMeasureSpinner = (key: FoodItemKey, value: number) => {
        const convertedValue = itemSwitch ? handleConversion(value, unit, "g") : handleConversion(value, unit, 'l')
        setNewitem({ ...newItem, [key]: convertedValue })
    }

    const handleTypeChange = () => {

        // 'as X' ei ole tarpeen, selkeyttää vain lukijalle koodia
        if (mealHandler.isMeal(newItem)) {
            const { weightInGrams: _, ...transItem } = newItem
            setNewitem({ ...transItem, volumeInl: 0 } as Drink)
            setItemSwitch(!itemSwitch)
            setUnit("l")
        }
        else {
            const { volumeInl: _, ...transItem } = newItem
            setNewitem({ ...transItem, weightInGrams: 0 } as Meal)
            setItemSwitch(!itemSwitch)
            setUnit("g")
        }
    }

    // Todo! Lisää totalMacros lasku ennen tallennusta
    const handleSave = () => {
        const macros = macroSum(newItem)
        handleAdd({ ...newItem, totalMacros: macros })
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
            <Grid container sx={{ margin: 2, alignItems: 'center' }}>
                <Grid size={6}>
                    <TextField
                        name="name"
                        value={newItem.name}
                        label={t("addItem.name")}
                        onChange={handleChange}
                        variant="standard"
                    />
                </Grid>
                <Grid size={6}>
                    <ButtonGroup variant="contained">
                        <Button disabled={!itemSwitch} onClick={handleTypeChange}>
                            {t("addItem.liquid")}
                        </Button>
                        <Button disabled={itemSwitch} onClick={handleTypeChange}>
                            {t("addItem.solid")}
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
            <Paper>
                {renderKeys.map((key, index) => (
                    <Grid
                        key={key}
                        container spacing={2}
                        sx={{
                            width: '100%',
                            backgroundColor: index % 2 === 0 ? 'transparent' : 'action.hover',
                            padding: '1px',
                            alignItems: 'center'
                        }}>
                        <Grid size={6}>
                            <Typography>{t(`addItem.${key}`)}</Typography>
                        </Grid>
                        <Grid size={6}>
                            <NumberSpinner
                                name="key"
                                value={newItem[key]}
                                onValueChange={(value) => handleSpinnerChange(key, value ?? 0)}
                                size="small"
                                min={0}
                            />
                        </Grid>
                    </Grid>
                ))}
            </Paper>

            <Box sx={{ margin: 1}}>
                {mealHandler.isMeal(newItem) ?
                    <Grid container
                        sx={{
                            alignItems: 'center'
                        }}
                    >
                        <Grid size={4}>
                            <Typography>{t("addItem.weightInGrams")}</Typography>
                        </Grid>
                        <Grid size={8} justifyContent="flex-end" alignItems="center" display="flex">
                            <NumberSpinner
                                size="small"
                                name="weightInGrams"
                                value={displayValue}
                                onValueChange={(value) => handleMeasureSpinner("weightInGrams" as keyof FoodItem, value ?? 0)}
                            />
                            <ButtonGroup size="small" orientation="vertical">
                                <Button disabled={unit === "mg"} onClick={() => setUnit("mg")}>mg</Button>
                                <Button disabled={unit === "g"} onClick={() => setUnit("g")}>g</Button>
                                <Button disabled={unit === "kg"} onClick={() => setUnit("kg")}>kg</Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                    :
                    <Grid container>
                        <Grid>
                            <Typography>{t("addItem.volumeInl")}</Typography>
                        </Grid>
                        <Grid>
                            <NumberSpinner
                                size="small"
                                name="volumeInl"
                                value={displayValue}
                                onValueChange={(value) => handleMeasureSpinner("volumeInl" as keyof FoodItem, value ?? 0)}
                            />
                        </Grid>
                        <Grid>
                            <ButtonGroup size="small">
                                <Button disabled={unit === "ml"} onClick={() => setUnit("ml")}>ml</Button>
                                <Button disabled={unit === "dl"} onClick={() => setUnit("dl")}>dl</Button>
                                <Button disabled={unit === "l"} onClick={() => setUnit("l")}>l</Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                }
            </Box>
            <Box
                sx={{
                    width: '100%',
                    justifyContent: 'center',
                    display: 'flex'
                }}
            >
                <ButtonGroup variant="contained">
                    <Button onClick={handleSave} color="success">
                        {t("common.save")}
                    </Button>
                    <Button onClick={handleCancel} color="error">
                        {t("common.cancel")}
                    </Button>
                </ButtonGroup>
                </Box>
        </Container>
    )
}