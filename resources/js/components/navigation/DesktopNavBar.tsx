import React from 'react'
import classNames from 'classnames'
import { NavLink } from 'react-router'
import { HOME_ROUTE, ROUTES } from 'Constants/routes'

const linkClassName = ({isActive}: {isActive: boolean}) => classNames(
    // inline-block keeps the label's glow layer aligned; the negative margin preserves the row height.
    'glow-edge glow-text -my-2 inline-block rounded-md px-3 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300 motion-reduce:transition-none',
    isActive ? 'bg-white/10 text-white' : 'text-slate-300 hover:bg-white/5 hover:text-white',
)

const DesktopNavBar = () => (
<nav className="hidden md:block">
    <ul className="flex space-x-1">
        <li key={HOME_ROUTE.name}>
            <NavLink to={HOME_ROUTE.path} end className={linkClassName} data-label={HOME_ROUTE.name} data-spotlight>
                {HOME_ROUTE.name}
            </NavLink>
        </li>
        {Object.values(ROUTES).map(({name: routeName, path, state}) => (
            <li key={routeName}>
                <NavLink to={path} state={state} className={linkClassName} data-label={routeName} data-spotlight>
                    {routeName}
                </NavLink>
            </li>
        ))}
    </ul>
</nav>
)

export default DesktopNavBar
