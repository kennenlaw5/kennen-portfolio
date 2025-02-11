import React, {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import {HOME_ROUTE} from 'Constants/routes'
import DesktopNavBar from 'Components/navigation/DesktopNavBar'
import MobileNavBar from 'Components/navigation/MobileNavBar'
import HamburgerButton from 'Components/navigation/HamburgerButton'

type THeaderProps = {
  isLoading?: boolean
}

const Header: React.FC<THeaderProps> = ({isLoading = false}) => {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (isLoading) {
      return
    }

    const handleResize = () => {
      if (window.innerWidth >= 768 && isOpen) {
        setIsOpen(false)
      }
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [isOpen, isLoading])

  const toggleMenu = () => setIsOpen(prev => !prev)
  const closeMenu = () => setIsOpen(false)

  return (
    <header className="relative bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h3 className="font-bold">
          <Link to={HOME_ROUTE.path} onClick={closeMenu}>Kennen Lawrence</Link>
        </h3>
        {!isLoading ? (
          <>
            <DesktopNavBar />
            <HamburgerButton {...{isOpen, toggleMenu}} />
          </>
        ) : null}
      </div>
      <MobileNavBar {...{isOpen, closeMenu}} />
    </header>
  )
}

export default Header
