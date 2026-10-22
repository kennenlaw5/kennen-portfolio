import React from 'react'
import {FaSpinner} from 'react-icons/fa'
import Header from 'Components/layout/Header'

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
        <Header isLoading />
        <div className="flex items-center justify-center h-screen w-full">
            <FaSpinner className="animate-spin text-cyan-400 text-4xl mb-4 motion-reduce:animate-none" />
        </div>
    </div>
  )
}

export default Loading
