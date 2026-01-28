import { Box, Typography } from "@mui/material";
import './DayPlanner.css'
import { useEffect, useRef, useState } from "react";
import { mealHandler } from "../services/mealHandler";
import { drinkHandler } from "../services/drinkHandler";
import { sortList, type FoodItem } from "../services/sortList";
import ItemSourceList from "../components/ItemSourceList";
import { DndContext, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";

const LIST_IDS = {
    SOURCE: 'source',
    TARGET: 'target'
}

export default function DayPlanner() {
    const [sourceList, setSourceList] = useState<FoodItem[]>([])
    const [malleableList, setMalleableList] = useState<FoodItem[]>([])
    const [dragSource, setDragSource] = useState<string | null>(null)
    const sourceRef = useRef<HTMLDivElement | null>(null)
    const targetRef = useRef<HTMLDivElement | null>(null)
    
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
        if (!over || !targetRef || !sourceRef) return
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
                // Sort tapahtuma jos over = lista ja lista on source
                // Käyttää useRef päättelemään onko dragend over elementin ylä vai alapäässä
                // tämän perusteella aktiivinen drag olio siirretään joko listan ylä tai alapäähän

                const activeIndex = malleableList.findIndex(item => item.id === active.data.current?.id)
                let newIndex: number | null = null

                const rect = sourceRef.current?.getBoundingClientRect()
                const y = (e.activatorEvent as MouseEvent).clientY
                
                if (rect && y < rect.top) {
                    newIndex = 0
                }
                else if (rect && y > rect.bottom) {
                    newIndex = malleableList.length - 1
                }

                if (newIndex === null || activeIndex === newIndex) return

                const next = [...malleableList]
                const [moved] = next.splice(activeIndex, 1)
                next.splice(newIndex, 0, moved)
                setMalleableList(next)
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
                // Sort tapahtuma jos over = rivi
                // Yleisin sorttaukseen ainakin käytössä source listaan, ehkä target.
                // Hakee over ja active indeksit, over tässä tapauksessa pakko olla useSortable listan rivi/item
                // poistaa activen ja siirtää sen over indeksin alle, over ja loput siirtyvät +1 index
                // Ehkä pitää muuttaa, riippuen animaatiosta ja miten "siirtyvät" rivit vaikuttaa käsittelyyn

                const overIndex = malleableList.findIndex(item => item.id === over.data.current?.id)
                const activeIndex = malleableList.findIndex(item => item.id === active.data.current?.id)
                const next = [...malleableList]
                const [moved] = next.splice(activeIndex, 1)
                next.splice(overIndex, 0 , moved)
                setMalleableList(next)
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
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
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
                        <ItemSourceList 
                        listId={LIST_IDS.SOURCE} 
                        sourceList={sourceList} 
                        malleableList={malleableList} 
                        setSourceList={setSourceList} 
                        setMalleableList={setMalleableList} 
                        listRef={sourceRef}
                        />
                    </Box>
                </Box>
            </Box>
        </DndContext>
    )
}