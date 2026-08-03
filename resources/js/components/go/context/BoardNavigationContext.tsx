import React, {createContext, ReactNode, useContext} from 'react'
import useBoardNavigation, {TBoardNavigation} from 'Components/go/hooks/useBoardNavigation'

type TBoardNavigationProviderProps = {
    children: ReactNode
}

const BoardNavigationContext = createContext<TBoardNavigation | undefined>(undefined)

export const useBoardNavigationContext = (): TBoardNavigation => {
    const context = useContext(BoardNavigationContext)

    if (!context) {
        throw new Error('useBoardNavigationContext must be used within a BoardNavigationProvider')
    }

    return context
}

export const BoardNavigationProvider: React.FC<TBoardNavigationProviderProps> = ({children}) => {
    const navigation = useBoardNavigation()

    return (
        <BoardNavigationContext.Provider value={navigation}>
            {children}
        </BoardNavigationContext.Provider>
    )
}
