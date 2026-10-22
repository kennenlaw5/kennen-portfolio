import React, {useState, useEffect} from 'react'
import {Link} from 'react-router'
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
    <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/70 text-white backdrop-blur-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h3 className="text-xl font-semibold tracking-tight">
          <Link
            to={HOME_ROUTE.path}
            onClick={closeMenu}
            className="inline-flex items-center gap-2 rounded-md text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            <span aria-hidden="true" className="font-mono text-cyan-400">&gt;_</span>
            Kennen Lawrence
          </Link>
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
