import { Box, Typography } from "@mui/material"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"


type cardHeaderBarProps = {
    title: string
    listeners: any
    attributes: any
}

export default function CardHeaderBar({ title, listeners, attributes }: cardHeaderBarProps) {

    return(
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                px: 1.5,
                py: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
                userSelect: 'none'
            }}
        >
            <Box
                {...listeners}
                {...attributes}
                onClick={(e: React.MouseEvent) => e.stopPropagation()}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'grab',
                    mr: 1,
                    color: 'text.secondary',
                    '&:hover': { color: 'text.primary' }
                }}
            >
                <DragIndicatorIcon fontSize="small" />
            </Box>

            <Typography variant="subtitle1" noWrap>
                {title}
            </Typography>
        </Box>
    )

}