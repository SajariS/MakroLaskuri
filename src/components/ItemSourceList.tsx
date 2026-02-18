import { useContext, useEffect, useRef, useState } from "react";
import { Box, Button, ButtonGroup, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper, TextField } from "@mui/material";
import { sortList } from "../services/sortList";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import ItemCard from "./ItemCard";
import { LangContext } from "../context/LangContext";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import type { FoodItem, FoodItemKey } from "../interfaces/FoodItem";

type ItemSourceListProps = {
    sourceList: FoodItem[]
    malleableList: FoodItem[]
    setSourceList: (list: FoodItem[]) => void
    setMalleableList: (list: FoodItem[]) => void
    setAddDia: (state: boolean) => void
    listId: string
    listRef: React.RefObject<HTMLDivElement | null>
}

type optionsType = {
    i18n: string | undefined,
    key: FoodItemKey
}

export default function ItemSourceList({sourceList, setSourceList, malleableList, setMalleableList, listId, listRef, setAddDia}: ItemSourceListProps) {
    const [search, setSearch] = useState<string>("")
    const [sortOpen, setSortOpen] = useState<boolean>(false)
    const anchorRef = useRef<HTMLDivElement>(null)
    const [sortIndex, setSortIndex] = useState<number>(1)
    const { texts } = useContext(LangContext)
    const t = (key: string) => texts?.[key ?? key]
    // Kuvaa nykyistä tilaa, sort funktio kääntää true = norm, false = inv
    // Eli Jos tila on norm, muuttuja false = seuraava sort on inv ja toggle -> true jne.
    const [sortInversion, setSortInversion] = useState<boolean>(false)

    const sortOptions: optionsType[] = [
        {i18n: t("sortOptions.name"), key: "name"}, 
        {i18n: t("sortOptions.kcal"), key: "kcal"}, 
        {i18n: t("sortOptions.sugar"), key: "sugar"}
    ]

    const handleSortToggle = () => {
        setSortOpen((prevState) => !prevState)
    }

    const handleSortEvent = (inversion?: boolean, index?: number ) => {
        // Valinnaiset param mukana koska tilamuuttja ei pysy perässä,
        // tapahtumassa jossa sort valitaan dropdown menusta
        // Kulku: Normaali - paina nappia -> sort + inversio toggle, uusi painallus -> inversio sort + inversio toggle
        // Suoraan menusta: - valtise sort -> sort + inversio toggle, uusin painallaus sen jälkeen kun valittu -> inversio sort + toggle,
        // uusi sort valinta menusta -> pakotettu normi sort + pakotettu tila inversioon
        const sortedList = sortList(
            malleableList, 
            sortOptions[index === undefined ? sortIndex : index].key, 
            inversion === undefined ? sortInversion : inversion
        ) as FoodItem[]
        console.log(sortedList)
        setMalleableList(sortedList)
        console.log("Manual Inversion: " + inversion)
        console.log("Sort inversion: " + sortInversion)

        if (inversion === undefined) {
            setSortInversion((prev) => !prev)
        }
        else {
            setSortInversion(!inversion)
        }
    }

    const handleSortMenuClick = (index: number) => {
        setSortIndex(index)
        setSortOpen(false)
        handleSortEvent(
            index === sortIndex ? false : true,
            index
        )
    }

    const handleClose = (e: Event) => {
        if (anchorRef.current && anchorRef.current.contains(e.target as HTMLElement)) return
        setSortOpen(false)
    }

    const { setNodeRef } = useDroppable({
        id: listId,
        data: {
            type: 'list'
        }

    })

    const setRefs = (node: HTMLDivElement | null) => {
        listRef.current = node
        setNodeRef(node)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    useEffect(() => {
        if (!search) {
            setMalleableList(sourceList)
        }
        const filtered = sourceList.filter((item) => item.name.toLocaleLowerCase().includes(search.toLocaleLowerCase()))
        setMalleableList(filtered)
    }, [search])

    if (!texts) return <p>Loading...</p>

    return (
        <Box>
            <Button
                size="small"
                onClick={() => setAddDia(true)}
            >TODO! Siirrä ja i18n. Lisäys nappi</Button>
            <TextField 
                value={search}
                onChange={handleChange}
                placeholder="TODO! Hae nimen perusteella"
            />
            <ButtonGroup
                variant="contained"
                ref={anchorRef}
            >
                <Button onClick={() => handleSortEvent()}>{sortOptions[sortIndex].i18n}</Button>
                <Button
                    size="small"
                    onClick={handleSortToggle}
                >
                    <ArrowDropDownIcon />
                </Button>
            </ButtonGroup>
            <Popper
                sx={{ zIndex: 1}}
                open={sortOpen}
                anchorEl={anchorRef.current}
                role={undefined}
                transition
                disablePortal
            >
                {({ TransitionProps, placement}) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin: placement === "bottom" ? "center top" : "center bottom"
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                                <MenuList id="split-button-menu" autoFocusItem>
                                    {sortOptions.map((option, index) => (
                                        <MenuItem
                                            key={index}
                                            selected={index === sortIndex}
                                            onClick={() => handleSortMenuClick(index)}
                                        >
                                            {option.i18n}
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
            <Box ref={setNodeRef}
                sx={{
                    height: 800,
                    overflowY: 'auto',
                    border: '1px solid gray',
                    padding: 1
            }}>
                <SortableContext items={malleableList} strategy={verticalListSortingStrategy}>
                    {malleableList.map(item => (
                        <ItemCard item={item} listId={listId} key={item.id} />
                    ))}
                </SortableContext>
            </Box>
        </Box>
    )
}