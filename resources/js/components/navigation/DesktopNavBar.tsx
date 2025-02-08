import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import { ROUTES } from 'Constants/routes'

const DesktopNavBar = () => (
<nav className="hidden md:block">
    <ul className="flex space-x-4">
        {Object.entries(ROUTES).map(([routeName, route]) => (
            <li key={routeName}>
                <Link to={route} className="hover:underline">
                    {routeName[0] + routeName.slice(1).toLowerCase()}
                </Link>
            </li>
        ))}
    </ul>
</nav>
)

export default DesktopNavBar
