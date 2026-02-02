import { useEffect, useState, type LinkHTMLAttributes } from "react";
import type { FoodItem, FoodItemKey } from "../services/sortList";
import { Box, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import type { Macros } from "../interfaces/Nutrition";
import { Bar, BarChart, PieChart, Tooltip, XAxis, YAxis, type BarShapeProps } from "recharts";
import KcalPie from "./KcalPie";
import { NumberField } from "@base-ui/react/number-field";
import NumberSpinner from "./NumberSpinner";

type MacroCalcProps = {
    foodItems: FoodItem[]
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

export function MacroCalc({ foodItems }: MacroCalcProps) {
    const [limits, setLimits] = useState<LimitsType[]>([
        {toggle: false, key: "protein", limit: 0, sum: 0},
        {toggle: false, key: "carbs", limit: 0, sum: 0}, 
        {toggle: false, key: "sugar", limit: 0, sum: 0},
        {toggle: false, key: "kcal", limit: 0, sum: 0},
        {toggle: false, key: "fat", limit: 0, sum: 0},
        {toggle: false, key: "hardFat", limit: 0, sum: 0},
        {toggle: false, key: "salt", limit: 0, sum: 0},
    ])

    const handleSum = () => {
        const acc: Totals = Object.create(null)

        for (const item of foodItems) {
            const macros = item.totalMacros
            for (const key in macros) {
                acc[key] = (acc[key] ?? 0) + macros[key as keyof Macros]
            }
        }

        setLimits(limits.map(item => ({
            ...item,
            sum: acc[item.key] ?? 0
        })))
    }

    const handleLimitValueChange = (key: string, value: number | null) => {
        if (value === null) return
        const newLimits = limits.map(item => {
            if (item.key === key) return {...item, limit: value}
            return item
        })
        setLimits(newLimits)
    }

    const handleLimitToggleChange = (key: string) => {
        const newLimits = limits.map(item => item.key === key ? {...item, toggle: !item.toggle} : item)
        setLimits(newLimits)
    }

    const checkKcalToggle = () => {
        const kcalRow = limits.find((row) => row.key === "kcal")
        if (!kcalRow) return false

        return kcalRow.toggle
    }

    const handleKcalLimitPrint = () => {
        const kcalRow = limits.find((row) => row.key === "kcal")
        if (!kcalRow) return 0
        return kcalRow.limit
    }

    const handleKcalSumPrint = () => {
        const kcalRow = limits.find((row) => row.key === "kcal")
        if (!kcalRow) return 0
        return kcalRow.sum
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

    useEffect(() => {
        if (foodItems.length > 0) handleSum()
    }, [foodItems])

    //TODO! Siirrä KCAL palkki pois omaan osioon. Tee siitä kond. rend, raja = false, pelkkä numero. 
    // raja = true, piechart. 1 osa kcal ja toinen osa kond. rend. Jos alle raja = virheä tausta ja title under, yli = punainen tausta ja title over

    return (
        <Paper elevation={1}>
            <Paper>
                <Box>
                    {checkKcalToggle() ?
                        <KcalPie sum={handleKcalSumPrint()} limit={handleKcalLimitPrint()}/>
                    :
                        <Typography>TODO! Iso KCAL teksti: {handleKcalSumPrint()}</Typography>
                    }
                    <BarChart
                        width={500}
                        height={300}
                        data={limits}
                        margin={{ top: 20, bottom: 20 }}
                    >
                        <XAxis dataKey="key" />
                        <YAxis/>
                        <Tooltip />
                        <Bar dataKey="sum" shape={barRender} />
                    </BarChart>
                </Box>
                <Box>
                    {limits.map(item => (
                        <Box>
                            <Typography>{item.key}</Typography>
                            <Switch
                                checked={item.toggle}
                                onChange={() => handleLimitToggleChange(item.key)}
                            />
                            {item.toggle && 
                            <NumberSpinner
                                label={item.key + ": limit"}
                                min={0}
                                size="small"
                                value={item.limit}
                                onValueChange={(value) => handleLimitValueChange(item.key, value)}
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
                        {foodItems.map((item) => (
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