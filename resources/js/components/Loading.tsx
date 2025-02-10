import React from 'react'
import {FaSpinner} from 'react-icons/fa'
import Header from './Header'

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen">
        <Header isLoading />
        <div className="flex items-center justify-center h-screen w-full bg-gray-100">
            <FaSpinner className="animate-spin text-blue-600 text-4xl mb-4" />
        </div>
    </div>
  )
}

export default Loading
