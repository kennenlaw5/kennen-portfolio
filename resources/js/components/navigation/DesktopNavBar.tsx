import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import { HOME_ROUTE, ROUTES } from 'Constants/routes'

const DesktopNavBar = () => (
<nav className="hidden md:block">
    <ul className="flex space-x-4">
        <li key={HOME_ROUTE.name}>
            <Link to={HOME_ROUTE.path} className="hover:underline">
                {HOME_ROUTE.name}
            </Link>
        </li>
        {Object.values(ROUTES).map(({name: routeName, path}) => (
            <li key={routeName}>
                <Link to={path} className="hover:underline">{routeName}</Link>
            </li>
        ))}
    </ul>
</nav>
)

export default DesktopNavBar
