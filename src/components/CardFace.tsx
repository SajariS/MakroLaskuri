import { CardContent } from "@mui/material"


type CardFaceProps = {
    children: React.ReactNode
    back?: boolean
}

export default function CardFace({ children, back }: CardFaceProps) {
    return(
        <CardContent
            sx={{
                position: 'absolute',
                inset: 0,
                backfaceVisibility: 'hidden',
                transform: back ? 'rotateY(180deg)': 'rotateY(0deg)'
            }}
        >
            {children}
        </CardContent>
    )
}