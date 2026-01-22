import { useEffect, useRef } from "react";
import { useTabs, type TabId } from "../context/TabsContext";
import { Box } from "@mui/material";
import { AnimatePresence, motion } from "motion/react";

type pageByTabType = { tab: TabId }

const tabOrder: TabId[] = ['dayPlanner', 'testi']

function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T | undefined>(undefined)
    useEffect(() => {
        ref.current = value
    }, [value])
    return ref.current
}

export default function PageContainer() {

    const { tab } = useTabs()
    const prevTab = usePrevious(tab)

    const direction = prevTab && tabOrder.indexOf(tab) > tabOrder.indexOf(prevTab) ? 1 : -1

    const pageVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
            position: 'absolute'
        }),
        center: {
            x: 0,
            opacity: 1,
            postion: 'relative'
        },
        exit: (direction: number) => ({
            x: direction > 0 ? '-100%': '100%',
            opacity: 0,
            position: 'absolute'
        })
    }

    // Lisää sivu komponentit tänne renderöintiä varten
    const PageByTab = ({ tab }: pageByTabType) => {
        switch (tab) {
            case 'dayPlanner':
                return //TODO SIVU
            case 'testi':
                return //TODO SIVU
            default:
                return null
        }
    }

    return(
        <Box sx={{ position: 'relative', overflow: 'hidden'}}>
            <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                    key={tab}
                    custom={direction}
                    variants={pageVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.35, ease: 'easeInOut'}}
                >
                    <PageByTab tab={tab} />
                </motion.div>
            </AnimatePresence>
        </Box>
    )
}