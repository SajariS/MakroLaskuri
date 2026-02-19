import { useSortable } from "@dnd-kit/sortable"
import { useContext, useState } from "react"
import { CSS } from "@dnd-kit/utilities"
import type { Drink } from "../interfaces/Drink"
import type { Meal } from "../interfaces/Meal"
import { Box, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import CardHeaderBar from "./CardHeaderBar"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { FoodItem, FoodItemNumberKey } from "../interfaces/FoodItem"
import { LangContext } from "../context/LangContext"
import NumberSpinner from "./NumberSpinner"
import { mealHandler } from "../services/mealHandler"

type itemCardProps = {
    item: Drink | Meal
    listId: string | undefined
    handleAmountChange?: (item: FoodItem, amount: number) => void
}

export default function ItemCard({ item, listId, handleAmountChange }: itemCardProps) {
    const { texts } = useContext(LangContext)
    const t = (key: string) => texts?.[key ?? key]
    const [expanded, setExpanded] = useState<boolean>(false)
    const [count, setCount] = useState<number>(1)
    const isMeal = mealHandler.isMeal(item)
    const tableKeys = [
        "kcal", 
        "fat", 
        "hardFat", 
        "carbs", 
        "sugar", 
        "protein", 
        "salt"
    ]

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        isDragging,
        transition
    } = useSortable({
        id: item.id,
        data: {
            type: 'item',
            originId: listId,
            item: { ...item, amount: count }
        }
    })
         
    const handleChange = (value: number) => {
        setCount(value)
        if (handleAmountChange) handleAmountChange(item, value)
    }

    return(
        <Box 
            ref={setNodeRef}
            sx={{
                width: '100%',
                perspective: '1000px',
                cursor: 'pointer',
                transform: CSS.Translate.toString(transform),
                transition,
                visibility: isDragging ? 'hidden' : 'visible',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
        
            <CardHeaderBar
                title={item.name}
                listeners={listeners}
                attributes={attributes}
            />
            
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%'
                }}
            >
                <IconButton
                    size="small"
                    onClick={() => setExpanded(prev => !prev)}
                    sx={{
                        transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "0.2s"
                    }}
                >
                    <ExpandMoreIcon />
                </IconButton>

                <Box>
                    <Typography>{`${t("itemCard.kcalSum")} ${listId === "source" ? item.totalMacros.kcal * count : item.totalMacros.kcal}`}</Typography>
                </Box>

                <Box>
                    <NumberSpinner 
                        min={1}
                        value={count}
                        onValueChange={(value) => handleChange(value ?? 1)}
                        size="small"
                    />
                </Box>
                <button onClick={() => console.log(listId)}>DEbug</button>
            </Box>   
            <Collapse in={expanded} timeout="auto" unmountOnExit>
                <Box
                    sx={{
                        mt: 1,
                        pt: 1,
                        borderTop: "1px solid",
                        borderColor: "divider"
                    }}
                >
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t("itemCard.nutrition")}</TableCell>
                                    <TableCell>{isMeal ? t("itemCard.per100g") : t("itemCard.per100ml")}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableKeys.map((key) => (
                                    <TableRow
                                        key={key}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>{t(`macros.${key}`)}</TableCell>
                                        <TableCell>{item[key as FoodItemNumberKey]}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            </Collapse> 
        </Box>
    )

}