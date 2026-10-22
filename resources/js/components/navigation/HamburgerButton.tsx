import React from 'react'
import {FaBars, FaTimes} from 'react-icons/fa'

type THamburgerButtonProps = {
    isOpen: boolean
    toggleMenu: () => void
}

const HamburgerButton: React.FC<THamburgerButtonProps> = ({isOpen, toggleMenu}) => (
    <div className="md:hidden">
        <button
            onClick={toggleMenu}
            className="rounded-md p-1 text-slate-200 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            aria-label="Toggle navigation"
        >
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
    </div>
)

export default HamburgerButton
