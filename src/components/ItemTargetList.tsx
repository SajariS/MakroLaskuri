import { Box, Button } from "@mui/material"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import ItemCard from "./ItemCard"
import type { FoodItem } from "../interfaces/FoodItem"
import { useDroppable } from "@dnd-kit/core"
import { green } from "@mui/material/colors"
import { macroMultiply } from "../services/calculations"


type ItemTargetListProps = {
    targetList: FoodItem[]
    listId: string
    setTargetList: (list: FoodItem[]) => void
}

export default function ItemTargetList({ targetList, listId, setTargetList }: ItemTargetListProps) {
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
            <Button onClick={() => console.log(targetList)}>debug</Button>
            <SortableContext items={targetList} strategy={verticalListSortingStrategy}>
                {targetList.map(item => (
                    <ItemCard item={item} listId={listId} key={item.id} handleAmountChange={handleAmountChange}/>
                ))}
            </SortableContext>
        </Box>
    )
}