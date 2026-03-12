import { useContext, useState } from "react"
import type { FoodItem, FoodItemKey, FoodItemNumberKey } from "../interfaces/FoodItem"
import { mealHandler } from "../services/mealHandler"
import { handleConversion, type Unit } from "../services/calculations"
import { Container, Grid, Paper, Typography } from "@mui/material"
import NumberSpinner from "./NumberSpinner"
import { LangContext } from "../context/LangContext"

type UpdateItemProps = {
    item: FoodItem
    setToggle: (state: boolean) => void
    handleSave: (newItem: FoodItem) => void
}

// @ts-ignore
export default function UpdateItem({ item, setToggle, handleSave }: UpdateItemProps) {
    const { texts } = useContext(LangContext)
    const t = (key: string) => texts?.[key ?? key]
    const [updatedItem, setUpdatedItem] = useState(item ?? mealHandler.createDefault())
    const isMeal = mealHandler.isMeal(updatedItem)
    const renderKeys: FoodItemNumberKey[] = ["kcal", "protein", "carbs", "sugar", "fat", "hardFat", "salt"]
    const [unit, setUnit] = useState<Unit>(isMeal ? 'g' : 'l')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedItem({ ...updatedItem, [e.target.name]: e.target.value })
    }

    const handleSpinnerChange = (key: FoodItemKey, value: number) => {
        setUpdatedItem({ ...updatedItem, [key]: value })
    }

    const handleMeasureSpinner = (key: FoodItemKey, value: number) => {
        const convertedValue = isMeal ? handleConversion(value, unit, "g") : handleConversion(value, unit, 'l')
        setUpdatedItem({ ...updatedItem, [key]: convertedValue })
    }

    return (
        <Container>
            <Typography variant="h2">Muokkaus TODO! i18n</Typography>
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
                                value={updatedItem[key]}
                                onValueChange={(value) => handleSpinnerChange(key, value ?? 0)}
                                size="small"
                                min={0}
                            />
                        </Grid>
                    </Grid>
                ))}
            </Paper>
        </Container>
    )
}