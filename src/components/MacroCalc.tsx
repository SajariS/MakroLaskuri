import { useContext, useEffect, useState, type LinkHTMLAttributes } from "react";
import { Box, Button, ButtonGroup, Collapse, Grid, keyframes, List, ListItem, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import type { MacroKeys, Macros } from "../interfaces/Nutrition";
import { Bar, BarChart, PieChart, Tooltip, XAxis, YAxis, type BarShapeProps } from "recharts";
import KcalPie from "./KcalPie";
import NumberSpinner from "./NumberSpinner";
import type { Day } from "../interfaces/Day";
import type { FoodItemKey, FoodItemNumberKey } from "../interfaces/FoodItem";
import { LangContext } from "../context/LangContext";

type MacroCalcProps = {
    day: Day
    handleLimitToggle: (key: string) => void
    handleLimitChange: (key: keyof Macros, value: number) => void
}

type LimitsType = {
    toggle: boolean
    key: FoodItemKey
    limit: number
    sum: number
}

type Totals = {
    [key: string]: number
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
            displayValue: `${value} ${t(`macros.${listKey}`)} - TODO oma lyhenne!`
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

    const barRender = (props: BarShapeProps) => {
        const { x, y, width, height, payload } = props
        const overLimit = payload.toggle && payload.sum > payload.limit
        

        return (
            <g>
                <rect x={x} y={y} width={width} height={height} fill={overLimit ? "red" : "blue"} />
                <text 
                    x={x + width / 2}
                    y={y + height / 2}
                    fill="white"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize={12}
                >
                    {payload.sum}
                </text>
                {payload.toggle && (
                    <line 
                        x1={x}
                        x2={x + width}
                        y1={y + height -((payload.limit / payload.sum) * height)}
                        y2={y + height -((payload.limit / payload.sum) * height)}
                        stroke="black"
                        strokeWidth={2}
                    />
                )}
            </g>
        )
    }

    return (
        <Paper elevation={1}>
            <Paper>
                <Box>
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

            </Paper>
            <Paper>
                <ButtonGroup size="small" variant="contained">
                    {macroKeys.map((key) => (
                        <Button
                            disabled={listKey === key}
                            onClick={() => setListKey(key)}
                        >
                            {t(`macros.${key}`)}
                        </Button>
                    ))}
                </ButtonGroup>
                <List dense>
                    {listData.map((item) => (
                        <ListItem key={item.id}>
                            <Grid container alignItems="center">
                                <Grid size={3}>
                                    <Typography>{item.name}</Typography>
                                </Grid>
                                <Grid size={3} textAlign="right">
                                    <Typography>{item.percent}</Typography>
                                </Grid>
                                <Grid size={3} textAlign="right">
                                    <Typography color="text.secondary">{item.displayValue}</Typography>
                                </Grid>
                            </Grid>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        </Paper>
    )

}