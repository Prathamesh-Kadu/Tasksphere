import { useRef, useEffect } from "react"

const useCancelableRequest = () => {

    const controllerRef = useRef<AbortController | null>(null)

    const createSignal = () => {

        if (controllerRef.current) {
            controllerRef.current.abort()
        }

        controllerRef.current = new AbortController()

        return controllerRef.current.signal
    }

    useEffect(() => {

        return () => {
            controllerRef.current?.abort()
        }

    }, [])

    return { createSignal }
}

export default useCancelableRequest