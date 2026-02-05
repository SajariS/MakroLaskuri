import { useEffect, useState, type LinkHTMLAttributes } from "react";
import type { FoodItem, FoodItemKey } from "../services/sortList";
import { Box, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import type { Macros } from "../interfaces/Nutrition";
import { Bar, BarChart, PieChart, Tooltip, XAxis, YAxis, type BarShapeProps } from "recharts";
import KcalPie from "./KcalPie";
import NumberSpinner from "./NumberSpinner";
import type { Day } from "../interfaces/Day";

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

export function MacroCalc({ day, handleLimitToggle, handleLimitChange }: MacroCalcProps) {


    /*const [limits, setLimits] = useState<LimitsType[]>([
        {toggle: false, key: "protein", limit: 0, sum: 0},
        {toggle: false, key: "carbs", limit: 0, sum: 0}, 
        {toggle: false, key: "sugar", limit: 0, sum: 0},
        {toggle: false, key: "kcal", limit: 0, sum: 0},
        {toggle: false, key: "fat", limit: 0, sum: 0},
        {toggle: false, key: "hardFat", limit: 0, sum: 0},
        {toggle: false, key: "salt", limit: 0, sum: 0},
    ])*/

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
                    {day.kcalLimit ?
                        <KcalPie sum={day.totalMacros.kcal} limit={day.macroLimits.kcal}/>
                    :
                        <Typography>TODO! Iso KCAL teksti: {day.totalMacros.kcal}</Typography>
                    }
                    <BarChart
                        width={500}
                        height={300}
                        data={Object.entries(day.totalMacros).filter(([key]) => key !== "kcal").map(([key, value]) => ({ key, value }))}
                        margin={{ top: 20, bottom: 20 }}
                    >
                        <XAxis dataKey="key" />
                        <YAxis/>
                        <Tooltip />
                        <Bar dataKey="value" shape={barRender} />
                    </BarChart>
                </Box>
                <Box>
                    {Object.entries(day.macroLimits).map(([key, value]) => (
                        <Box>
                            <Typography>{key}</Typography>
                            <Switch
                                checked={checkLimitToggle(key)}
                                onChange={() => handleLimitToggle(key)}
                            />
                            {checkLimitToggle(key) && 
                            <NumberSpinner
                                label={key + ": limit"}
                                min={0}
                                size="small"
                                value={value}
                                onValueChange={(value) => handleLimitChange(key as keyof Macros, value ?? 0)}
                            />}
                        </Box>
                    ))}
                </Box>

            </Paper>
            <TableContainer component={Paper}>
                <Table size="small" sx={{ minWidth: 650}}>
                    <TableHead>
                        <TableRow>
                            <TableCell>TODO! Makros title</TableCell>
                            <TableCell align="right">TODO! Kcal</TableCell>
                            <TableCell align="right">TODO! Protein</TableCell>
                            <TableCell align="right">TODO! Carbs</TableCell>
                            <TableCell align="right">TODO! Sugar</TableCell>
                            <TableCell align="right">TODO! fat</TableCell>
                            <TableCell align="right">TODO! hardFat</TableCell>
                            <TableCell align="right">TODO! salt</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {day.meals.map((item) => (
                            <TableRow key={item.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell component="th" scope="row">{item.name}</TableCell>
                                <TableCell align="right">{item.kcal}</TableCell>
                                <TableCell align="right">{item.protein}</TableCell>
                                <TableCell align="right">{item.carbs}</TableCell>
                                <TableCell align="right">{item.sugar}</TableCell>
                                <TableCell align="right">{item.fat}</TableCell>
                                <TableCell align="right">{item.hardFat}</TableCell>
                                <TableCell align="right">{item.salt}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Paper>
    )

}