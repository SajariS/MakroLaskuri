import { AppBar, Box, IconButton, Menu, MenuItem, Tab, Tabs, Toolbar, useTheme } from "@mui/material";
import LanguageIcon from "@mui/icons-material/Language"
import { useContext, useState } from "react";
import { useTabs, type TabId } from "../context/TabsContext";
import { LangContext } from "../context/LangContext";

const TABS_KEY = 'tabs'

export default function Header() {
    const theme = useTheme()
    const { texts, changeLang, lang } = useContext(LangContext)
    const t = (key: string) => texts?.[key ?? key]
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const { tab, setTab } = useTabs()
    const renderLang = ["fi", "en", "sv"]

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

    const handleLangChange = (value: string) => {
        changeLang(value)
        handleCloseLangMenu()
    }

    return(
        <AppBar position="static">
            <Toolbar>
                <Box sx={{ flex: 1}} />

                <Toolbar sx={{ display: 'flex', gap: 2}}>
                    <Tabs 
                        value={tab} 
                        onChange={(_, value) => handleTabChange(value)}
                        textColor="inherit"
                        sx={{
                            "& .MuiTabs-indicator": {
                                backgroundColor: theme.palette.common.white,
                                height: 3
                            }
                        }}
                    >
                        <Tab label={t("headerTabs.DayPlanner")} value="DayPlanner" />
                        <Tab label={t("headerTabs.faq")} value="Faq" />
                    </Tabs>
                </Toolbar>

                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end'}}>
                    <IconButton color="inherit" onClick={handleOpenLangMenu}>
                        <LanguageIcon />
                    </IconButton>

                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleCloseLangMenu}>
                        {renderLang.map((key) => (
                            <MenuItem
                                onClick={() => handleLangChange(key)}
                                key={key}
                                sx={{
                                    backgroundColor: key === lang ? theme.palette.action.hover : "inherit"
                                }}
                            >
                                {t(`langSelection.${key}`)}
                            </MenuItem>
                        ))}
                    </Menu>

                </Box>
            </Toolbar>
        </AppBar>
    )
}