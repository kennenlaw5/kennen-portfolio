import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {HOME_ROUTE} from 'Constants/routes'
import DesktopNavBar from 'Components/navigation/DesktopNavBar'
import MobileNavBar from 'Components/navigation/MobileNavBar'
import HamburgerButton from 'Components/navigation/HamburgerButton'

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen])

  const toggleMenu = () => setIsOpen(prev => !prev)
  const closeMenu = () => setIsOpen(false)

  return (
    <header className="relative bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to={HOME_ROUTE.path} onClick={closeMenu}>Kennen Lawrence</Link>
        </div>
        <DesktopNavBar />
        <HamburgerButton {...{isOpen, toggleMenu}} />
      </div>
      <MobileNavBar {...{isOpen, closeMenu}} />
    </header>
  )
}

export default Header
