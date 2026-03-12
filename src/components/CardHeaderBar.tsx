import { Box, Grid, IconButton, Tooltip, Typography, useTheme } from "@mui/material"
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import { useContext } from "react"
import { LangContext } from "../context/LangContext"

type cardHeaderBarProps = {
    title: string
    listeners: any
    attributes: any
    isMeal: boolean
    handleRemove: () => void
    context: string
}

export default function CardHeaderBar({ title, listeners, attributes, isMeal, handleRemove, context}: cardHeaderBarProps) {
    const theme = useTheme()
    const { texts } = useContext(LangContext)
    const t = (key: string) => texts?.[key ?? key]
    
    return(
        <Grid
            container
            sx={{
                display: 'flex',
                alignItems: 'center',
                px: 1.5,
                py: 1,
                borderBottom: '1px solid',
                borderColor: 'divider',
                userSelect: 'none',
                background: isMeal ?
                    `linear-gradient(90deg, transparent 0%, ${theme.palette.success.main}40 60%)` :
                    `linear-gradient(90deg, transparent 0%, ${theme.palette.info.main}40 60%)`
            }}
        >
            <Grid
                size={1}
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
            </Grid>
            
            <Grid size={8}>
                <Typography variant="h6" noWrap>
                    {title}
                </Typography>
            </Grid>
            
            <Grid size="grow">
                <Tooltip
                    title={context === "target" ? t("itemCard.removeTarget"): t("itemCard.removeSource")}
                    placement="left"
                >
                    <IconButton size="small" onClick={handleRemove}>
                        <DeleteOutlineIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </Grid>
        </Grid>
    )

}