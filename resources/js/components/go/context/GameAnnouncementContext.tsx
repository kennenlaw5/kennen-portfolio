import React, {createContext, ReactNode, useCallback, useContext, useState} from 'react'

type TGameAnnouncementProviderProps = {
    children: ReactNode
}

type TGameAnnouncement = {
    message: string
    revision: number
}

type TGameAnnouncer = (message: string) => void

const GameAnnouncerContext = createContext<TGameAnnouncer | undefined>(undefined)
const GameAnnouncementContext = createContext<TGameAnnouncement | undefined>(undefined)

export const useGameAnnouncer = (): TGameAnnouncer => {
    const announce = useContext(GameAnnouncerContext)

    if (!announce) {
        throw new Error('useGameAnnouncer must be used within a GameAnnouncementProvider')
    }

    return announce
}

export const useGameAnnouncement = (): TGameAnnouncement => {
    const announcement = useContext(GameAnnouncementContext)

    if (!announcement) {
        throw new Error('useGameAnnouncement must be used within a GameAnnouncementProvider')
    }

    return announcement
}

export const GameAnnouncementProvider: React.FC<TGameAnnouncementProviderProps> = ({children}) => {
    const [announcement, setAnnouncement] = useState<TGameAnnouncement>({
        message: '',
        revision: 0,
    })
    const announce = useCallback((message: string) => {
        setAnnouncement(current => ({
            message,
            revision: current.revision + 1,
        }))
    }, [])

    return (
        <GameAnnouncerContext.Provider value={announce}>
            <GameAnnouncementContext.Provider value={announcement}>
                {children}
            </GameAnnouncementContext.Provider>
        </GameAnnouncerContext.Provider>
    )
}
