import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language"
import SettingsIcon from "@mui/icons-material/Settings"
import { useState } from "react";


export default function Header() {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const [naviState, setNaviState] = useState< 'front' | 'mid' | 'back'>("front") 

    const handleOpenLangMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget)
    }

    const handleCloseLangMenu = () => {
        setAnchorEl(null)
    }


    return(
        <AppBar position="static">
            <Toolbar>
                <Box sx={{ flex: 1}} />

                <Box sx={{ display: 'flex', gap: 2}}>
                    <Button disabled={naviState === "front"} >TODO! Navi Front</Button>
                    <Button disabled={naviState === "mid"}>TODO! NAvi 2</Button>
                    <Button disabled={naviState === "back"} >TODO! Navi 3</Button>
                </Box>

                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end'}}>
                    <IconButton color="inherit" onClick={handleOpenLangMenu}>
                        <LanguageIcon />
                    </IconButton>

                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseLangMenu}>
                        <MenuItem onClick={() => console.log("TODO")}>Fi</MenuItem>
                        <MenuItem onClick={() => console.log("TODO!")}>En</MenuItem>
                        <MenuItem onClick={() => console.log("TODO")}>Sv</MenuItem>
                    </Menu>

                    <IconButton color="inherit" onClick={() => console.log("TODO")}>
                        <SettingsIcon />
                    </IconButton>
                </Box>
            </Toolbar>
        </AppBar>
    )
}