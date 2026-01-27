import { useEffect, useState } from "react";
import { Box, TextField } from "@mui/material";
import type { FoodItem } from "../services/sortList";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import ItemCard from "./ItemCard";

type ItemSourceListProps = {
    sourceList: FoodItem[]
    malleableList: FoodItem[]
    setSourceList: (list: FoodItem[]) => void
    setMalleableList: (list: FoodItem[]) => void
    listId: string
    listRef: React.RefObject<HTMLDivElement | null>
}

export default function ItemSourceList({sourceList, setSourceList, malleableList, setMalleableList, listId, listRef}: ItemSourceListProps) {
    const [search, setSearch] = useState<string>("")

    const { setNodeRef } = useDroppable({
        id: 'listId',
        data: {
            type: 'list'
        }

    })

    const setRefs = (node: HTMLDivElement | null) => {
        listRef.current = node
        setNodeRef(node)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    useEffect(() => {
        if (!search) {
            setMalleableList(sourceList)
        }
        const filtered = sourceList?.filter((item) => {
            item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        })

        setMalleableList(filtered)
    }, [search])

    return (
        <Box>
            <TextField 
                value={search}
                onChange={handleChange}
                placeholder="TODO! Hae nimen perusteella"
            />
            <Box ref={setRefs}>
                <SortableContext items={malleableList} strategy={verticalListSortingStrategy}>
                    {malleableList.map(item => (
                        <ItemCard item={item} listId={listId} />
                    ))}
                </SortableContext>
            </Box>
        </Box>
    )
}