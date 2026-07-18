import { useEffect, useMemo, useState } from "react"
import type { Drink } from "../interfaces/Drink"
import type { FoodItem, FoodItemKey, FoodItemNumberKey } from "../interfaces/FoodItem"
import type { Meal } from "../interfaces/Meal"
import { mealHandler } from "../services/mealHandler"
import { Box, Button, Container, Grid, Input, Paper, Typography } from "@mui/material"

type FoodItemDialogProps = {
    onClose: () => void
    initialData?: Partial<FoodItem>
    onSave: (item: FoodItem) => void
}

type StepConfig = {
    key: FoodItemKey
    label?: string
    helper?: string
    type?: "text" | "number"
    variant?: "toggle"
    visibleFor?: "all" | "meal" | "drink"
    group?: string
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
    const [stepIndex, setStepIndex] = useState(0)

    const numberKeys: FoodItemNumberKey[] = [
        "amount",
        "kcal",
        "fat",
        "hardFat",
        "carbs",
        "sugar",
        "protein",
        "salt"
    ]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (numberKeys.includes(e.target.name as FoodItemNumberKey)) {
            if (!/^\d*$/.test(e.target.value) && e.target.value !== "") return
        }
        setForm({...form, [e.target.name]: e.target.value})
    }

    const sourceSteps: StepConfig[] = [
        {
            key: "name",
            label: "Nimi",
            helper: "Anna ruualle nimi",
            type: "text"
        },
        {
            key: "kcal",
            label: "Energia",
            helper: "Anna energia arvo",
            type: "number"
        },
        {
            key: "fat",
            label: "Rasva",
            helper: "Anna rasvan määrä",
            type: "number"
        },
        {
            key: "hardFat",
            label: "Tyydyttynyt rasva",
            helper: "Anna tyydyttyneen rasvan määrä",
            type: "number"
        },
        {
            key: "carbs",
            label: "Hiilihydraatit",
            helper: "Anna hiilihydraattien määrä",
            type: "number"
        },
        {
            key: "sugar",
            label: "Sokerit",
            helper: "Anna sokereiden määrä",
            type: "number"
        },
        {
            key: "protein",
            label: "Proteiini",
            helper: "Anna proteiinin määrä",
            type: "number"
        },
        {
            key: "salt",
            label: "Suola",
            helper: "Anna suolan määrä",
            type: "number"
        }
    ]

    const getFilteredSteps = (steps: StepConfig[], itemType: ItemSwitch) => {
        return steps.filter((step) => {
            if (!step.visibleFor || step.visibleFor === "all") return true
            return step.visibleFor === itemType
        })
    }

    const renderSteps = useMemo(
        () => getFilteredSteps(sourceSteps, itemType), [itemType]
    )
    const currentStep = renderSteps[stepIndex]

    useEffect(() => {
        if (stepIndex >= renderSteps.length) {
            setStepIndex(renderSteps.length - 1)
        }
    }, [renderSteps, stepIndex])

    const renderStep = (step: StepConfig) => (
        <Grid container>
            {step.label && (
                <Grid size={12}>
                    <Typography>{step.label}</Typography>
                </Grid>
            )}

            {step.helper && (
                <Grid size={12}>
                    <Typography>{step.helper}</Typography>
                </Grid>
            )}

            {step.variant === "toggle" && (
                <>
                    <Grid size={6}>
                        <Button
                            onClick={() => setItemType("food")}
                        >
                            Kiinteä TODO i18n
                        </Button>
                    </Grid>
                    <Grid size={6}>
                        <Button
                            onClick={() => setItemType("drink")}
                        >
                            Neste TODO i18n
                        </Button>
                    </Grid>
                </>
            )}

            {step.type && (
                <Grid size={12}>
                    <Input
                        type="text"
                        name={step.key}
                        value={form[step.key] ?? ""}
                        onChange={handleChange}
                        inputMode={step.type === "number" ? "numeric" : "text"}
                    />
                </Grid>
            )}
        </Grid>
    )

    return (
        <Container>
            <Paper>
                <Typography>Header TODO</Typography>

                {renderStep(currentStep)}

                <Box>
                    <Button
                        onClick={() => setStepIndex((prev) => prev - 1)}
                        disabled={stepIndex === 0}
                    >
                        Takaisin
                    </Button>
                    <Button
                        onClick={() => setStepIndex((prev) => prev + 1)}
                        disabled={stepIndex === renderSteps.length - 1}
                    >
                        Seuraava
                    </Button>
                    <Button
                        onClick={() => console.log(renderSteps)}
                        >
                        debug
                    </Button>
                </Box>
            </Paper>
        </Container>
    )
}