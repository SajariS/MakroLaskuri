import { useEffect, useState } from "react";
import { Box, TextField } from "@mui/material";
import type { FoodItem } from "../services/sortList";
import { useDroppable } from "@dnd-kit/core";

type ItemSourceListProps = {
    sourceList: FoodItem[]
    malleableList: FoodItem[]
    setSourceList: (list: FoodItem[]) => void
    setMalleableList: (list: FoodItem[]) => void
    listId: string
}

export default function ItemSourceList({sourceList, setSourceList, malleableList, setMalleableList, listId}: ItemSourceListProps) {
    const [search, setSearch] = useState<string>("")

    const { setNodeRef } = useDroppable({
        id: 'listId',
        data: {
            type: 'list'
        }

    })

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
        <Box ref={setNodeRef}>
            <TextField 
                value={search}
                onChange={handleChange}
                placeholder="TODO! Hae nimen perusteella"
            />


        </Box>
    )
}