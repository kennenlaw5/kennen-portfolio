import React from 'react'
import {Link} from 'react-router-dom'
import {HOME_ROUTE, ROUTES} from 'Constants/routes'
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
            <li key={HOME_ROUTE.name} className="border-t border-blue-600">
                <Link
                    to={HOME_ROUTE.path}
                    onClick={closeMenu}
                    className="block text-center py-3 transition hover:bg-blue-600"
                >
                    {HOME_ROUTE.name}
                </Link>
            </li>
            {Object.values(ROUTES).map(({name: routeName, path}) => (
                <li key={routeName} className="border-t border-blue-600">
                    <Link
                        to={path}
                        onClick={closeMenu}
                        className="block text-center py-3 transition hover:bg-blue-600"
                    >
                        {routeName}
                    </Link>
                </li>
            ))}
        </ul>
    </nav>
)

export default MobileNavBar
