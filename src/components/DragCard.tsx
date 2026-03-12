import { Card, Grid, Typography, useTheme } from "@mui/material";
import type { FoodItem } from "../interfaces/FoodItem";
import { mealHandler } from "../services/mealHandler";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator"
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline"
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import NumberSpinner from "./NumberSpinner";

type DragCardProps = {
    item: FoodItem
}

export default function DragCard({ item }: DragCardProps) {
    const theme = useTheme();
    const isMeal = mealHandler.isMeal(item);

    return (
        <Card
            elevation={3}
            sx={{
                width: "95%",
                pointerEvents: "none",
                opacity: 0.9,
                display: "flex",
                flexDirection: "column",
                border: "1px solid",
                borderColor: "divider",
            }}
        >
            {/* Header */}
            <Grid
                container
                sx={{
                    alignItems: "center",
                    px: 1.5,
                    py: 1,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    background: isMeal
                        ? `linear-gradient(90deg, transparent 0%, ${theme.palette.success.main}40 60%)`
                        : `linear-gradient(90deg, transparent 0%, ${theme.palette.info.main}40 60%)`,
                }}
            >
                <Grid size={1} sx={{ color: "text.secondary" }}>
                    <DragIndicatorIcon fontSize="small" />
                </Grid>

                <Grid size={8}>
                    <Typography variant="h6" noWrap>
                        {item.name}
                    </Typography>
                </Grid>

                <Grid size="grow">
                    <DeleteOutlineIcon fontSize="small" />
                </Grid>
            </Grid>

            {/* Kcal summary */}
            <Grid container alignItems="center">
                <Grid size={1}>
                    <ExpandMoreIcon />
                </Grid>
                <Grid size="grow">
                    <Typography variant="body2">
                        {`Kcal: ${item.totalMacros.kcal}`}
                    </Typography>
                </Grid>
                <Grid size={5}>
                    <NumberSpinner
                        value={item.amount}
                        size="small"
                    />
                </Grid>
            </Grid>
        </Card>
    )
}