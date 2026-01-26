import { useSortable } from "@dnd-kit/sortable"
import { useState } from "react"
import { CSS } from "@dnd-kit/utilities"
import type { Drink } from "../interfaces/Drink"
import type { Meal } from "../interfaces/Meal"
import { Box, Card, Typography } from "@mui/material"
import CardFace from "./CardFace"
import CardHeaderBar from "./CardHeaderBar"
import { useTheme } from "@mui/material/styles"
import { nanoid } from "nanoid/non-secure"

type itemCardProps = {
    item: Drink | Meal
    listId: string | undefined
}

export default function ItemCard({ item, listId }: itemCardProps) {
    const [flipped, setFlipped] = useState<boolean>(false)

    const theme = useTheme()
    const cardRadius = theme.shape.borderRadius
    const cardShadow = 3

    // sortablelle oma ID, jotta jokaisella komponentilla on oma uniikki ID drag tunnistusta varten
    // Käyttää non-secure nanoid performanssin takia, id:n ei tartte olla kuin uniikki
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        isDragging
    } = useSortable({
        id: nanoid(), 
        data: {
            type: 'item',
            originId: listId,
            item
         }})

    const style = {
        transform: CSS.Translate.toString(transform),
        ocapacity: isDragging ? 0.8 : 1
    }

    return(
        <Box 
            ref={setNodeRef}
            style={style}
            sx={{
                width: 240,
                height: 160,
                perspective: '1000px',
                cursor: 'pointer'
            }}
        >
        
            <CardHeaderBar
                title={item.name}
                listeners={listeners}
                attributes={attributes}
            />

            <Box
                onClick={() => {
                    if (!isDragging) setFlipped(!flipped)
                }}
                sx={{
                    position: 'relative',
                    height: 120,
                    perspective: '1000px',
                    cursor: 'pointer'
                }}
            >
                <Box
                    sx={{
                        position: 'absolute',
                        inset: 0,
                        transformStyle: 'preserve-3d',
                        transition: 'transform 0.6s ease',
                        transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                        
                        backgroundColor: 'background.paper',
                        boxShadow: cardShadow,
                        border: cardRadius,

                    }}
                >
                    <CardFace>
                        <Typography>
                            Klikkaa tästä :3
                        </Typography>
                    </CardFace>

                    <CardFace back>
                        <Typography>
                            Pruuuuuttt
                        </Typography>
                    </CardFace>
                </Box>
            </Box>

        </Box>
    )

}