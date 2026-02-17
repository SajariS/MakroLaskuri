import { useSortable } from "@dnd-kit/sortable"
import { useState } from "react"
import { CSS } from "@dnd-kit/utilities"
import type { Drink } from "../interfaces/Drink"
import type { Meal } from "../interfaces/Meal"
import { Accordion, AccordionDetails, AccordionSummary, Box, Card, Collapse, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material"
import CardFace from "./CardFace"
import CardHeaderBar from "./CardHeaderBar"
import { useTheme } from "@mui/material/styles"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import type { FoodItem, FoodItemKey, FoodItemNumberKey } from "../interfaces/FoodItem"

type itemCardProps = {
    item: Drink | Meal
    listId: string | undefined
}

export default function ItemCard({ item, listId }: itemCardProps) {
    const [expanded, setExpanded] = useState<boolean>(false)
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
            item
         }})

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
                    <Typography>{`TODO! Kcal esitys: ${item.kcal}`}</Typography>
                </Box>

                <Box>
                    <p>Spinner!</p>
                </Box>
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
                                    <TableCell>i18n todo: Ravintoarvot</TableCell>
                                    <TableCell>todo cond g-ml, 100g</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {tableKeys.map((key) => (
                                    <TableRow
                                        key={key}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell>{`TODO i18n avaimella: ${key}`}</TableCell>
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