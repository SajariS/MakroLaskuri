import { Box, Dialog, Typography } from "@mui/material";
import './DayPlanner.css'
import { useEffect, useRef, useState } from "react";
import { mealHandler } from "../services/mealHandler";
import { drinkHandler } from "../services/drinkHandler";
import { sortList } from "../services/sortList";
import ItemSourceList from "../components/ItemSourceList";
import { DndContext, DragOverlay, useDroppable, type DragEndEvent, type DragStartEvent } from "@dnd-kit/core";
import { MacroCalc } from "../components/MacroCalc";
import type { Day } from "../interfaces/Day";
import ItemTargetList from "../components/ItemTargetList";
import type { Macros } from "../interfaces/Nutrition";
import AddItem from "../components/AddItem";
import type { FoodItem } from "../interfaces/FoodItem";
import DragCard from "../components/DragCard";

const LIST_IDS = {
    SOURCE: 'source',
    TARGET: 'target'
}

export default function DayPlanner() {
    const [sourceList, setSourceList] = useState<FoodItem[]>([])
    const [malleableList, setMalleableList] = useState<FoodItem[]>([])
    const sourceRef = useRef<HTMLDivElement | null>(null)
    const targetRef = useRef<HTMLDivElement | null>(null)
    const [addDialog, setAddDialog] = useState<boolean>(false)
    const [dragItem, setDragItem] = useState<FoodItem | null>(null)

    // Tyyppiä pitää muokata tarpeen tulleen ja koko sivun rakennetta muuttaa jos halutaan käyttää Day oliota
    // Tällä hetkellä käytössä vain lista jota kaikki komponentit käyttää ja laskee itse 
    // TODO! Selvitä voiko laskennan suorittaa kokonaan target list komponentin alla josta syötetään valmiiksi laskettu,
    // total keskikomponenttiin esitystä varten.
    const [day, setDay] = useState<Day>({
        weekday: 'ma',
        totalMacros: {
            protein: 0,
            carbs: 0,
            sugar: 0,
            fat: 0,
            hardFat: 0,
            kcal: 0,
            salt: 0,
        },
        macroLimits: {
            protein: 0,
            carbs: 0,
            sugar: 0,
            fat: 0,
            hardFat: 0,
            kcal: 0,
            salt: 0,
        },
        meals: [],
        proteinLimit: false,
        carbsLimit: false,
        sugarLimit: false,
        fatLimit: false,
        hardFatLimit: false,
        kcalLimit: false,
        saltLimit: false
    })

    const handleTotalSum = (items: FoodItem[]): Macros => {
        const totals = items.reduce((acc, item) => {
            for (const key in acc) {
                acc[key as keyof Macros] += item.totalMacros[key as keyof Macros]
            }
            return acc
        },
        {
            protein: 0,
            carbs: 0,
            sugar: 0,
            fat: 0,
            hardFat: 0,
            kcal: 0,
            salt: 0,
        } as Macros
        )
        return totals
    }

    const handleTargetAdd = (item: FoodItem | undefined) => {
        if (!item) return
        const newMeals = [...day.meals, item]
        if (newMeals.length === 0) return
        const newTotals = handleTotalSum(newMeals)
        setDay({...day, totalMacros: newTotals, meals: newMeals})
        setMalleableList(malleableList.filter(row => row.id !== item.id))
    }

    const handleTargetChange = (newList: FoodItem[]) => {
        const newTotals = handleTotalSum(newList)
        console.log(newList)
        console.log(newTotals)
        setDay({...day, meals: newList, totalMacros: newTotals})
    }

    // Id:n avulla poisto esim. filter ei tuota toivottua tulosta sillä target voi sisältää useamman,
    // samalla id:llä varustetun alkion.
    // Kompromissina poistetaan ensimmäisen vastaavuus indeksin perusteella
    // Tulevaisuudessa pitää katsoa saako drag/sort contextin dragendiin mukaan indeksin suoraan,
    // jolloin saadaan tarkka poisto listasta eikä vain ensimmäinen vastaavuus.
    const handleTargetRemove = (item: FoodItem | undefined) => {
        if (!item) return
        if (day.meals.length === 0) return
        const removeIndex = day.meals.findIndex(row => row.id === item.id)
        const newMeals = day.meals.splice(removeIndex, 1)
        const newTotal = handleTotalSum(newMeals)
        setDay({...day, meals: newMeals, totalMacros: newTotal})
    }

    const handleLimitToggle = (key: string) => {
        switch (key) {
            case "protein":
                setDay({...day, proteinLimit: !day.proteinLimit})
                break
            case "carbs":
                setDay({...day, carbsLimit: !day.carbsLimit})
                break
             case "sugar":
                setDay({...day, sugarLimit: !day.sugarLimit})
                break
            case "fat":
                setDay({...day, fatLimit: !day.fatLimit})
                break
            case "hardFat":
                setDay({...day, hardFatLimit: !day.hardFatLimit})
                break
            case "kcal":
                setDay({...day, kcalLimit: !day.kcalLimit})
                break
            case "salt":
                setDay({...day, saltLimit: !day.saltLimit})
                break
        }
    }

    const handleLimitChange = (key: keyof Macros, value: number) => {
        setDay({...day, macroLimits: {...day.macroLimits, [key]: value}})
    }

    const handleDragStart = (e:DragStartEvent) => {
        const dragData = e.active.data.current
        console.log(dragData?.item)
        setDragItem(!dragData ? null : dragData.item as FoodItem)
        // Voi olla turha kohta kokonaan, riippuu miten dnd etenee
        if (!dragData || dragData.type !== "item") return

        console.log("Drag start:" + dragData.originId)
    }

    const handleDragEnd = (e: DragEndEvent) => {
        setDragItem(null)
        const { active, over } = e
        console.log(`Dragend. active: ${active.id}, target: ${over?.id}`)
        if (!over || !targetRef || !sourceRef) return
        const dragSource = active.data.current?.originId
        const targetId = over.id
        const targetType = over.data.current?.type
        if (targetType === "list") {
            if (targetId !== dragSource && targetId === LIST_IDS.TARGET) {
                // Copy tapahtuma jos over = lista, 
                // tarvitsee tulevaisuudessa apufunktion jolla tallennetaan myös localstorageen
                handleTargetAdd(active.data.current?.item)
                return
            }
            /*
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
            } */
        }
        else if (targetType === "item") {
            const targetOriginId = over.data.current?.originId
            if (targetOriginId !== dragSource && targetOriginId === LIST_IDS.TARGET) {
                // Copy tapahtuma jos over = rivi/itemcard, 
                // ditto samaan tapahtumaan listan kanssa,
                // Käytetään jos target lista ei ole tyhjä ja drag päättyy sen rivien päälle.
                handleTargetAdd(active.data.current?.item)
                return
            } /*
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
            } */
        }
        
    }

    const handleAddItem = (newItem: FoodItem) => {
        (mealHandler.isMeal(newItem) ? mealHandler.add(newItem) : drinkHandler.add(newItem))
        .then(() => {
            console.log("Lisäys ok")
            setSourceList([...sourceList, newItem])
            setMalleableList([...malleableList, newItem])
        })
        .catch((err) => console.error(err))
    }

    const handleMalleableList = (newList: FoodItem[]) => {
        const duplicates = new Set(day.meals.map(item => item.id))
        const filteredList = newList.filter((item) => !duplicates.has(item.id))
        setMalleableList(filteredList)
    }

    useEffect(() => {
        const fetchLists = async() => {
            const mealList = await mealHandler.getAll()
            const drinkList = await drinkHandler.getAll()
            const filteredList = sortList([...mealList, ...drinkList], "name", true)
            setSourceList(filteredList as FoodItem[])
            handleMalleableList(filteredList as FoodItem[])
        }
        fetchLists()
    }, [])
    

    return(
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <Box className="pageRoot">
                <Box className="columns">
                    <Box className="column">
                        <Typography>TODO! Vastaanotto lista päivälle</Typography>
                        <ItemTargetList targetList={day.meals} listId={LIST_IDS.TARGET} setTargetList={handleTargetChange}/>
                    </Box>
                    <Box className="column center">
                        <MacroCalc day={day} handleLimitToggle={handleLimitToggle} handleLimitChange={handleLimitChange}/>
                    </Box>
                    <Box className="column">
                        <Typography>TODO! Lista kaikista muistin olioista + nappi lisäykseen</Typography>
                        <ItemSourceList 
                        listId={LIST_IDS.SOURCE} 
                        sourceList={sourceList} 
                        malleableList={malleableList} 
                        setSourceList={setSourceList} 
                        setMalleableList={handleMalleableList} 
                        listRef={sourceRef}
                        setAddDia={setAddDialog}
                        />
                    </Box>
                </Box>
            </Box>
            <Dialog
                open={addDialog}
                onClose={() => setAddDialog(false)}
            >
                <AddItem 
                    setToggle={setAddDialog}
                    handleAdd={handleAddItem}
                />
            </Dialog>
            <DragOverlay>
                {dragItem ?
                    <DragCard item={dragItem} />
                    : null
                }
            </DragOverlay>
        </DndContext>
    )
}