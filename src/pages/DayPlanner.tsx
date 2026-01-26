import { Box, Typography } from "@mui/material";
import './DayPlanner.css'
import { useEffect, useState } from "react";
import { mealHandler } from "../services/mealHandler";
import { drinkHandler } from "../services/drinkHandler";
import { sortList, type FoodItem } from "../services/sortList";
import ItemSourceList from "../components/ItemSourceList";
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core";

const LIST_IDS = {
    SOURCE: 'source',
    TARGET: 'target'
}

export default function DayPlanner() {
    const [sourceList, setSourceList] = useState<FoodItem[]>([])
    const [malleableList, setMalleableList] = useState<FoodItem[]>([])
    const [dragSource, setDragSource] = useState<string | null>(null)
    
    //Sijainen toisen listan komponentin tulevalle tila_listalle, joka luultavasti on Day.meals[]
    //Käytössä vain funktioiden tekoa varten, ei testausta. Korvaa targetList -> lopullisella koodista
    const [targetList, setTargetList] = useState<FoodItem[]>([])

    const handleDragStart = (e:DragStartEvent) => {
        const dragData = e.active.data.current
        if (!dragData || dragData.type !== "item") return

        if (targetList.some((item) => item.id === dragData.id)) {
            setDragSource(LIST_IDS.TARGET)
        }
        else {
            setDragSource(LIST_IDS.SOURCE)
        }
    }

    const handleDragEnd = (e: DragEndEvent) => {
        const { active, over } = e
        if (!over) return
        const targetId = over.id
        const targetType = over.data.current?.type

        if (targetType === "list") {
            if (targetId !== dragSource && targetId === LIST_IDS.TARGET) {
                // Copy tapahtuma jos over = lista, 
                // tarvitsee tulevaisuudessa apufunktion jolla tallennetaan myös localstorageen
                setTargetList([...targetList, active.data.current?.item])
                return
            }
            else if (targetId === dragSource && targetId === LIST_IDS.SOURCE) {
                // Sort tapahtuma jos over = lista,
                // Vaikea sortata ilman lisäkontekstia oletettavasti tapahtuu jos dragend ylä tai ala päässä
                // TODO selvitä mitä tehdään tarkemmin
                return
            }
        }
        else if (targetType === "item") {
            const targetOriginId = over.data.current?.originId
            if (targetOriginId !== dragSource && targetOriginId === LIST_IDS.TARGET) {
                // Copy tapahtuma jos over = rivi/itemcard, 
                // ditto samaan tapahtumaan listan kanssa,
                // Käytetään jos target lista ei ole tyhjä ja drag päättyy sen rivien päälle.
                setTargetList([...targetList, active.data.current?.item])
                return
            }
            else if (targetOriginId === dragSource && targetOriginId === LIST_IDS.SOURCE) {
                //TODO
                // Sort tapahtuma jos over = rivi
                // Yleisin sorttaukseen ainakin käytössä source listaan, ehkä target.
                // Hae over rivin indeksi listasta, siirrä active rivin indeksi +/-1 tästä
            }
        }
        
    }

    useEffect(() => {
        const fetchLists = async() => {
            const mealList = await mealHandler.getAll()
            const drinkList = await drinkHandler.getAll()
            const filteredList = sortList([...mealList, ...drinkList], "name", true)
            setSourceList(filteredList as FoodItem[])
            setMalleableList(filteredList as FoodItem[])
        }
        fetchLists()
    }, [])
    

    return(
        <Box className="pageRoot">
            <Box className="columns">
                <Box className="column">
                    <Typography>TODO! Vastaanotto lista päivälle</Typography>
                </Box>
                <Box className="column center">
                    <Typography>TODO! Laskuri</Typography>
                </Box>
                <Box className="column">
                    <Typography>TODO! Lista kaikista muistin olioista + nappi lisäykseen</Typography>
                    <ItemSourceList listId={LIST_IDS.SOURCE} sourceList={sourceList} malleableList={malleableList} setSourceList={setSourceList} setMalleableList={setMalleableList} />
                </Box>
            </Box>
        </Box>
    )
}