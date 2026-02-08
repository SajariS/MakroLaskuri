import { Box } from "@mui/material"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import ItemCard from "./ItemCard"
import type { FoodItem } from "../interfaces/FoodItem"


type ItemTargetListProps = {
    targetList: FoodItem[]
    listId: string
}

export default function ItemTargetList({ targetList, listId }: ItemTargetListProps) {
    
    return(
        <Box>
            <SortableContext items={targetList} strategy={verticalListSortingStrategy}>
                {targetList.map(item => (
                    <ItemCard item={item} listId={listId} />
                ))}
            </SortableContext>
        </Box>
    )
}