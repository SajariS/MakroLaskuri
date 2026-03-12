import { useContext, useState } from "react";
import { Box, Chip, Collapse, Divider, Grid, List, ListItem, Switch, Tooltip, Typography } from "@mui/material";
import type { MacroKeys, Macros } from "../interfaces/Nutrition";
import NumberSpinner from "./NumberSpinner";
import type { Day } from "../interfaces/Day";
import type { FoodItemNumberKey } from "../interfaces/FoodItem";
import { LangContext } from "../context/LangContext";
import { motion } from "motion/react"

type MacroCalcProps = {
    day: Day
    handleLimitToggle: (key: string) => void
    handleLimitChange: (key: keyof Macros, value: number) => void
}

type dynamicMacroKey = FoodItemNumberKey & MacroKeys

export function MacroCalc({ day, handleLimitToggle, handleLimitChange }: MacroCalcProps) {
    const macroKeys: dynamicMacroKey[] = ["kcal", "protein", "carbs", "sugar", "fat", "hardFat", "salt"]
    const { texts } = useContext(LangContext)
    const t = (key: string) => texts?.[key ?? key]
    const [listKey, setListKey] = useState<dynamicMacroKey>("kcal")

    const listData = day.meals.map((item) => {
        const value = item.totalMacros[listKey]
        const percent = day.totalMacros ? Math.round((value / day.totalMacros[listKey as MacroKeys]) * 100) : 0

        return {
            id: item.id,
            name: item.name,
            percent,
            displayValue: `${value} ${t(`calcList.${listKey}`)}`
        }
    }).sort((a, b) => b.percent - a.percent)

    const percentageColor = (percent: number) => {
        if (percent > 105) return "error.main"
        if (percent >= 101) return "warning.main"
        return "success.main"
    }

    const renderPercentage = (base: number, part: number) => {
        const percent = Math.round((part / base) * 100)
        if (Number.isNaN(percent)) return (<Typography sx={{ color: percentageColor(0)}}>{0}%</Typography>)

        return(
            <Typography sx={{ color: percentageColor(percent)}}>{percent}%</Typography>
        )
    }

    const checkLimitToggle = (key: string) => {
        switch (key) {
            case "protein":
                return day.proteinLimit
            case "carbs":
                return day.carbsLimit
            case "sugar":
                return day.sugarLimit
            case "kcal":
                return day.kcalLimit
            case "fat":
                return day.fatLimit
            case "hardFat":
                return day.hardFatLimit
            case "salt":
                return day.saltLimit
            default:
                return false
        }
    }

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                minHeight: 0
            }}
        >
            <Box
                sx={{
                    pb: 1
                }}
            >
                {macroKeys.map((key) => (
                    <Grid
                        container spacing={1}
                        alignItems="center"
                        key={key}
                        sx={{
                            minHeight: 50,
                            transition: 'background-color 150ms ease',
                            "&:hover": {
                                backgroundColor: 'action.hover'
                            }
                        }}>
                        <Grid size={3}>
                            <Typography>{t(`macros.${key}`)}</Typography>
                        </Grid>
                        <Grid size={3}>
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    alignItems: 'center',
                                }}
                            >
                                <Typography>{day.totalMacros[key]}</Typography>
                                <Collapse
                                    in={checkLimitToggle(key)}
                                    orientation="horizontal"
                                    sx={{
                                        overflow: 'hidden',
                                        display: 'inline-block',
                                        verticalAlign: 'middle'
                                    }}
                                >
                                    <Typography sx={{ whiteSpace: 'nowrap' }}>
                                        {" / "}
                                        {day.macroLimits[key]}
                                    </Typography>
                                </Collapse>
                            </Box>
                        </Grid>
                        <Grid size={1}>
                            <Collapse
                                in={checkLimitToggle(key)}
                                orientation="horizontal"
                            >
                                {renderPercentage(day.macroLimits[key], day.totalMacros[key])}
                            </Collapse>
                        </Grid>
                        <Grid size={2}>
                            <Switch
                                checked={checkLimitToggle(key)}
                                onChange={() => handleLimitToggle(key)}
                            />
                        </Grid>
                        <Grid size={3}>
                            <Collapse
                                in={checkLimitToggle(key)}
                                orientation="horizontal"
                            >
                                <NumberSpinner
                                    min={0}
                                    size="small"
                                    value={day.macroLimits[key]}
                                    onValueChange={(value) => handleLimitChange(key, value ?? 0)}
                                />
                            </Collapse>
                        </Grid>
                    </Grid>
                ))}
            </Box>

            <Divider
                sx={{ mb: 1 }}
            />

            <Box display="flex" gap={1} flexWrap="wrap">
                {macroKeys.map((key) => (
                    <Chip
                        key={key}
                        label={t(`macros.${key}`)}
                        clickable={listKey !== key}
                        variant={listKey === key ? 'filled' : 'outlined'}
                        onClick={() => setListKey(key)}
                        size="small"

                    />
                ))}
            </Box>
            <Box
                component={motion.div}
                layout
                sx={{
                    flex: 1,
                    overflowY: "auto",
                    overflowX: "hidden",
                    minHeight: 0,
                    pr: 0.5,
                    pt: 0.5
                }}
            >
                <List>
                    {listData.map((item) => (
                        <ListItem
                            key={item.id}
                            component={motion.div}
                            layout="position"
                            sx={{
                                justifyContent: 'flex-start',
                                "&:hover": {
                                    backgroundColor: 'action.hover'
                                },

                            }}>
                            <Grid container alignItems="center" spacing={2} sx={{ width: '100%' }}>
                                <Grid size={2}>
                                    <Tooltip
                                        title={t("calcList.toolTip")}
                                        placement="right"
                                    >
                                        <Chip
                                            label={`${item.percent}%`}
                                        />
                                    </Tooltip>
                                </Grid>
                                <Grid size={2}>
                                    <Typography>{item.name}</Typography>
                                </Grid>
                                <Grid size={5} textAlign="right">
                                    <Typography color="text.secondary">{item.displayValue}</Typography>
                                </Grid>
                            </Grid>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    )

}