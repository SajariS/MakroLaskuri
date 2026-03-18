import { useContext, useState } from "react"
import type { FoodItem, FoodItemKey, FoodItemNumberKey } from "../interfaces/FoodItem"
import { mealHandler } from "../services/mealHandler"
import { handleConversion, type Unit } from "../services/calculations"
import { Box, Button, ButtonGroup, Container, Grid, Paper, TextField, Typography } from "@mui/material"
import NumberSpinner from "./NumberSpinner"
import { LangContext } from "../context/LangContext"

type UpdateItemProps = {
    item: FoodItem
    setToggle: (state: boolean) => void
    handleEdit: (newItem: FoodItem) => void
}

// @ts-ignore
export default function UpdateItem({ item, setToggle, handleEdit }: UpdateItemProps) {
    const { texts } = useContext(LangContext)
    const t = (key: string) => texts?.[key ?? key]
    const [updatedItem, setUpdatedItem] = useState(item ?? mealHandler.createDefault())
    const renderKeys: FoodItemNumberKey[] = ["kcal", "protein", "carbs", "sugar", "fat", "hardFat", "salt"]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUpdatedItem({ ...updatedItem, [e.target.name]: e.target.value })
    }

    const handleSpinnerChange = (key: FoodItemKey, value: number) => {
        setUpdatedItem({ ...updatedItem, [key]: value })
    }

    const handleCancel = () => {
        setToggle(false)
    }

    const handleSave = () => {
        
    }

    return (
        <Container>
            <Grid container sx={{ margin: 2, alignItems: 'center' }}>
                <Grid size={6}>
                    <TextField
                        name="name"
                        value={item.name}
                        label={t("addItem.name")}
                        onChange={handleChange}
                        variant="standard"
                    />
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
                                value={item[key]}
                                onValueChange={(value) => handleSpinnerChange(key, value ?? 0)}
                                size="small"
                                min={0}
                            />
                        </Grid>
                    </Grid>
                ))}
            </Paper>

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