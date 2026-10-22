import React from 'react'
import {NavLink} from 'react-router'
import {HOME_ROUTE, ROUTES} from 'Constants/routes'
import classNames from 'classnames'

type TMobileNavBarProps = {
    isOpen: boolean
    closeMenu: () => void
}

const linkClassName = ({isActive}: {isActive: boolean}) => classNames(
    'block text-center py-3 transition hover:bg-white/5 focus-visible:outline-none focus-visible:bg-white/10 motion-reduce:transition-none',
    isActive ? 'text-cyan-300' : 'text-slate-200',
)

const MobileNavBar: React.FC<TMobileNavBarProps> = ({isOpen, closeMenu}) => (
    <nav
        className={classNames("md:hidden bg-slate-950/95 backdrop-blur-md overflow-hidden transition-all duration-300 ease-in-out absolute top-full left-0 w-full z-50", {
            "max-h-80 border-b border-white/10": isOpen,
            "max-h-0": !isOpen,
        })}
    >
        <ul className="flex flex-col">
            <li key={HOME_ROUTE.name} className="border-t border-white/10">
                <NavLink
                    to={HOME_ROUTE.path}
                    end
                    onClick={closeMenu}
                    className={linkClassName}
                >
                    {HOME_ROUTE.name}
                </NavLink>
            </li>
            {Object.values(ROUTES).map(({name: routeName, path, state}) => (
                <li key={routeName} className="border-t border-white/10">
                    <NavLink
                        to={path}
                        state={state}
                        onClick={closeMenu}
                        className={linkClassName}
                    >
                        {routeName}
                    </NavLink>
                </li>
            ))}
        </ul>
    </nav>
)

export default MobileNavBar
