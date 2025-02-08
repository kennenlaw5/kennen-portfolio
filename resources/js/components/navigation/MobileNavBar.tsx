import React from 'react'
import {Link} from 'react-router-dom'
import {ROUTES} from 'Constants/routes'
import classNames from 'classnames'

type TMobileNavBarProps = {
    isOpen: boolean
    closeMenu: () => void
}

const MobileNavBar: React.FC<TMobileNavBarProps> = ({isOpen, closeMenu}) => (
    <nav
        className={classNames("md:hidden bg-blue-500 overflow-hidden transition-all duration-300 ease-in-out absolute top-full left-0 w-full", {
            "max-h-80": isOpen,
            "max-h-0": !isOpen,
        })}
    >
        <ul className="flex flex-col">
            {Object.entries(ROUTES).map(([routeName, route]) => (
                <li className="border-t border-blue-600">
                    <Link
                        key={routeName}
                        to={route}
                        onClick={closeMenu}
                        className="block text-center py-3 transition hover:bg-blue-600"
                    >
                        {routeName[0] + routeName.slice(1).toLowerCase()}
                    </Link>
                </li>
            ))}
        </ul>
    </nav>
)

export default MobileNavBar
