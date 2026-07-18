import React, {createContext, useContext, useId, useState, Dispatch, SetStateAction} from 'react'

type TTooltipContextType = {
  showTooltip: boolean
  setShowTooltip: Dispatch<SetStateAction<boolean>>
  tooltipId: string
}

const TooltipContext = createContext<TTooltipContextType | undefined>(undefined)

type TTooltipProviderProps = {
    children: React.ReactNode
}

export const TooltipContextProvider: React.FC<TTooltipProviderProps> = ({children}) => {
  const [showTooltip, setShowTooltip] = useState<boolean>(false)
  const tooltipId = useId()

  const contextValue: TTooltipContextType = {
    showTooltip,
    setShowTooltip,
    tooltipId,
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
