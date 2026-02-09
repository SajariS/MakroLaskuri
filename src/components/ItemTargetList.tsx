import { Box, Button } from "@mui/material"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import ItemCard from "./ItemCard"
import type { FoodItem } from "../interfaces/FoodItem"
import { useDroppable } from "@dnd-kit/core"
import { green } from "@mui/material/colors"


type ItemTargetListProps = {
    targetList: FoodItem[]
    listId: string
}

export default function ItemTargetList({ targetList, listId }: ItemTargetListProps) {
    const { setNodeRef } = useDroppable({
        id: listId,
        data: {
            type: 'list'
        }
    })

    return(
        <Box ref={setNodeRef} sx={{ backgroundColor: green, minHeight: 400, minWidth: 400}}>
            <Button onClick={() => console.log(targetList)}>debug</Button>
            <SortableContext items={targetList} strategy={verticalListSortingStrategy}>
                {targetList.map(item => (
                    <ItemCard item={item} listId={listId} key={item.id}/>
                ))}
            </SortableContext>
        </Box>
    )
}