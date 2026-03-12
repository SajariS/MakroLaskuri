import { useContext, useDeferredValue, useEffect, useRef, useState } from "react";
import { Box, Button, ButtonGroup, ClickAwayListener, Divider, Grow, MenuItem, MenuList, Paper, Popper, TextField } from "@mui/material";
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
    setMalleableList: (list: FoodItem[]) => void
    setAddDia: (state: boolean) => void
    listId: string
    search: string
    setSearch: (keyword: string) => void
    removeRow: (item: FoodItem) => void
}

type optionsType = {
    i18n: string | undefined,
    key: FoodItemKey
}

export default function ItemSourceList({sourceList, malleableList, setMalleableList, listId, setAddDia, search, setSearch, removeRow}: ItemSourceListProps) {
    const [sortOpen, setSortOpen] = useState<boolean>(false)
    const anchorRef = useRef<HTMLDivElement>(null)
    const [sortIndex, setSortIndex] = useState<number>(1)
    const { texts } = useContext(LangContext)
    const t = (key: string) => texts?.[key ?? key]
    // Kuvaa nykyistä tilaa, sort funktio kääntää true = norm, false = inv
    // Eli Jos tila on norm, muuttuja false = seuraava sort on inv ja toggle -> true jne.
    const [sortInversion, setSortInversion] = useState<boolean>(false)
    const deferredSearch = useDeferredValue(search)

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
        setMalleableList(sortedList)

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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value)
    }

    
    useEffect(() => {
        if (!deferredSearch) {
            setMalleableList([...sourceList])
        }
        const filtered = sourceList.filter((item) => item.name.toLocaleLowerCase().includes(deferredSearch.toLocaleLowerCase()))
        setMalleableList(filtered)
    }, [deferredSearch])

    if (!texts) return <p>Loading...</p>

    return (
        <Box
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                minHeight: 0
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1
                }}
            >
                <Button
                    variant="contained"
                    size="small"
                    onClick={() => setAddDia(true)}
                >
                    {t("dayPlanner.addButton")}
                </Button>
                <TextField
                    value={search}
                    onChange={handleChange}
                    placeholder={t("dayPlanner.searchPlaceholder")}
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
                    sx={{ zIndex: 1 }}
                    open={sortOpen}
                    anchorEl={anchorRef.current}
                    role={undefined}
                    transition
                    disablePortal
                >
                    {({ TransitionProps, placement }) => (
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
            </Box>
            
            <Divider/>

            <Box ref={setNodeRef}
                sx={{
                    flex: 1,
                    overflowY: 'auto',
                    overflowX: 'hidden',
                    padding: 1
            }}>
                <SortableContext items={malleableList} strategy={verticalListSortingStrategy}>
                    {malleableList.map(item => (
                        <ItemCard item={item} listId={listId} key={item.id} contextualDelete={removeRow} />
                    ))}
                </SortableContext>
            </Box>
        </Box>
    )
}