import { useContext } from "react"
import { LangContext } from "../context/LangContext"
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, Link, List, ListItemButton, ListItemText, Typography } from "@mui/material"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


export default function Faq() {
    const { texts } = useContext(LangContext)
    const t = (key: string) => texts?.[key ?? key]
    const libraries = [
        { name: "React", url: "https://react.dev/" },
        { name: "MUI/Material", url: "https://mui.com/" },
        { name: "Motion", url: "https://motion.dev/" },
        { name: "Dnd-kit", url: "https://dndkit.com/overview" },
        { name: "Nanoid", url: "https://github.com/ai/nanoid" },
    ]

    return (
        <Box
            sx={{
                height: '80vh',
                overflowY: 'auto',
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                alignItems: 'center'
            }}
        >
            <Box>
                <Typography variant="h4">{t("faq.label")}</Typography>
            </Box>

            <Accordion
                sx={{ width: '80%' }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5">{t("faq.Qtech")}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Divider sx={{ mb: 1 }} />                    
                    <Typography>
                        {t("faq.Atech")}
                    </Typography>                   
                    <List>
                        {libraries.map((lib) => (
                            <ListItemButton
                                key={lib.name}
                                component={Link}
                                href={lib.url}
                                target="_blank"
                                rel="noopener"
                            >
                                <ListItemText primary={lib.name} />
                            </ListItemButton>
                        ))}
                    </List>
                </AccordionDetails>
            </Accordion>

            <Accordion
                sx={{ width: '80%' }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5">{t("faq.Qstorage")}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Divider sx={{ mb: 1 }} />                    
                    <Typography>
                        {t("faq.Astorage")}
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion
                sx={{ width: '80%' }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5">{t("faq.Qlanguages")}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Divider sx={{ mb: 1 }} />                    
                    <Typography>
                        {t("faq.Alanguages")}
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion
                sx={{ width: '80%' }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5">{t("faq.QdayPlanner")}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Divider sx={{ mb: 1 }} />                    
                    <Typography>
                        {t("faq.AdayPlanner1")}
                    </Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Typography>
                        {t("faq.AdayPlanner2")}
                    </Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Typography>
                        {t("faq.AdayPlanner3")}
                    </Typography>
                    <Divider sx={{ mb: 1 }} />
                    <Typography>
                        {t("faq.AdayPlanner4")}
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion
                sx={{ width: '80%' }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5">{t("faq.Qmobile")}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Divider sx={{ mb: 1 }} />                    
                    <Typography>
                        {t("faq.Amobile")}
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion
                sx={{ width: '80%' }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5">{t("faq.Qsecurity")}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Divider sx={{ mb: 1 }} />                    
                    <Typography>
                        {t("faq.Asecurity")}
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion
                sx={{ width: '80%' }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5">{t("faq.QmultiDevice")}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Divider sx={{ mb: 1 }} />                    
                    <Typography>
                        {t("faq.AmultiDevice")}
                    </Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion
                sx={{ width: '80%' }}
            >
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography variant="h5">{t("faq.Qopensource")}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Divider sx={{ mb: 1 }} />                    
                    <Typography>
                        {t("faq.Aopensource")}
                    </Typography>
                    <Link href="https://github.com/SajariS/MakroLaskuri" target="_blank" rel="noopener">
                        GitHub Repository
                    </Link>
                </AccordionDetails>
            </Accordion>                       
        </Box>
    )
}