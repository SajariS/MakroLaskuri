import { AppBar, Box, IconButton, Menu, MenuItem, Tab, Tabs, Toolbar } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language"
import SettingsIcon from "@mui/icons-material/Settings"
import { useState } from "react";
import { useTabs, type TabId } from "../context/TabsContext";

const TABS_KEY = 'tabs'

export default function Header() {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const { tab, setTab } = useTabs()

    const handleOpenLangMenu = (e: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(e.currentTarget)
    }

    const handleCloseLangMenu = () => {
        setAnchorEl(null)
    }

    const handleTabChange = (value: TabId) => {
        setTab(value)
        localStorage.setItem(TABS_KEY, value)
    }

    return(
        <AppBar position="static">
            <Toolbar>
                <Box sx={{ flex: 1}} />

                <Toolbar sx={{ display: 'flex', gap: 2}}>
                    <Tabs value={tab} onChange={(_, value) => handleTabChange(value)}>
                        <Tab label="Home TODO!" value="dayPlanner" />
                        <Tab label="Tab testi TODO!" value="testi" />
                    </Tabs>
                </Toolbar>

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