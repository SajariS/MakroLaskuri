import { useEffect } from "react"


type Options = {
    containerRef: React.RefObject<HTMLDivElement>
    activeId: string | null
    threshold?: number
    speed?: number
}

export function useAutoScroll({
    containerRef,
    activeId,
    threshold = 50,
    speed = 10
}: Options) {

    useEffect(() => {
        if (!activeId) return

        const handleMouseMove = (e: MouseEvent) => {
            const container = containerRef.current
            if (!container) return

            const rect = container.getBoundingClientRect()
            const cursorY = e.clientY
            const maxScrollTop = container.scrollHeight - container.clientHeight
            if (maxScrollTop <= 0) return

            if (cursorY < rect.top + threshold) {
                container.scrollBy({ top: -speed, behavior: 'auto'})
            }
            else if (cursorY > rect.bottom - threshold) {
                container.scrollBy({ top: speed, behavior: 'auto'})
            }
        }

        window.addEventListener("mousemove", handleMouseMove)

        return () => {
            window.removeEventListener("mousedown", handleMouseMove)
        }
    }, [activeId, containerRef, threshold, speed])
}