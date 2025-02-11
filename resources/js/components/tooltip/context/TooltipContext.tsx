import React, {createContext, useContext, useState, Dispatch, SetStateAction} from 'react'

type TTooltipContextType = {
  showTooltip: boolean
  setShowTooltip: Dispatch<SetStateAction<boolean>>
}

const TooltipContext = createContext<TTooltipContextType | undefined>(undefined)

type TTooltipProviderProps = {
    children: React.ReactNode
}

export const TooltipContextProvider: React.FC<TTooltipProviderProps> = ({children}) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false)

  const contextValue: TTooltipContextType = {
    showTooltip,
    setShowTooltip,
  }

  return (
    <TooltipContext.Provider value={contextValue}>
      {children}
    </TooltipContext.Provider>
  )
}

export const useTooltipContext = () => {
  const context = useContext(TooltipContext)

  if (context === undefined) {
    throw new Error('useTooltipContext must be used within a TooltipContextProvider')
  }

  return context
}
