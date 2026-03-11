import { Box, Button, Paper, Typography } from "@mui/material"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import ItemCard from "./ItemCard"
import type { FoodItem } from "../interfaces/FoodItem"
import { useDroppable } from "@dnd-kit/core"
import { green } from "@mui/material/colors"
import { macroMultiply } from "../services/calculations"
import { useContext } from "react"
import { LangContext } from "../context/LangContext"
import { motion } from "motion/react"


type ItemTargetListProps = {
    targetList: FoodItem[]
    listId: string
    setTargetList: (list: FoodItem[]) => void
    removeRow: (item: FoodItem) => void
}

export default function ItemTargetList({ targetList, listId, setTargetList, removeRow }: ItemTargetListProps) {
    const { texts } = useContext(LangContext)
    const t = (key: string) => texts?.[key ?? key]      
    const { setNodeRef } = useDroppable({
        id: listId,
        data: {
            type: 'list'
        }
    })

    const handleAmountChange = (item: FoodItem, value: number) => {
        const index = targetList.findIndex((row) => row.id === item.id)
        const newItem = {...item, 
            amount: value,
            totalMacros: macroMultiply({...item, amount: value})
        }
        const newList = targetList
        newList.splice(index, 1, newItem)
        setTargetList(targetList)
        
    }

    return(
        <Box ref={setNodeRef} sx={{ backgroundColor: green, minHeight: 400, minWidth: 400}}>
            <Typography variant="h4">{t("dayPlanner.targetLabel")}</Typography>
            <SortableContext items={targetList} strategy={verticalListSortingStrategy}>
                {targetList.length === 0 ? 
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            height: '100%'
                        }}
                    >
                        <Paper
                            component={motion.div}
                            elevation={3}
                            initial={{ opacity: 0, scale: 0.96 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.2 }}
                            sx={{
                                px: 4,
                                py: 3,
                                textAlign: "center",
                            }}
                        >
                            <Typography>{t("dayPlanner.targetPlaceholder")}</Typography>
                        </Paper>
                    </Box>
                :
                    targetList.map(item => (
                        <ItemCard item={item} listId={listId} key={item.id} handleAmountChange={handleAmountChange} contextualDelete={removeRow}/>
                    ))}
            </SortableContext>
        </Box>
    )
}