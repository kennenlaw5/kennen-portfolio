import React from 'react'
import {FaBars, FaTimes} from 'react-icons/fa'

type THamburgerButtonProps = {
    isOpen: boolean
    toggleMenu: () => void
}

const HamburgerButton: React.FC<THamburgerButtonProps> = ({isOpen, toggleMenu}) => (
    <div className="md:hidden">
        <button onClick={toggleMenu} className="focus:outline-none" aria-label="Toggle navigation">
            {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
    </div>
)

export default HamburgerButton
