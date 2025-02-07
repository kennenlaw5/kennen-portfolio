import { ROUTES } from 'Constants/routes'
import React from 'react'
import {Link, Route} from 'react-router-dom'

const Header = () => (
    <header className="bg-blue-600 text-white p-4">
        <div className="container mx-auto flex justify-between items-center px-4">
        <div className="text-2xl font-bold">Kennen Lawrence</div>
        <nav>
            <ul className="flex space-x-4">
                <li><Link to={ROUTES.HOME} className="hover:underline">Home</Link></li>
                <li><Link to={ROUTES.PROJECTS} className="hover:underline">Projects</Link></li>
                <li><Link to={`/${ROUTES.GAMES}`} className="hover:underline">Games</Link></li>
                <li><Link to={ROUTES.EXPERIENCE} className="hover:underline">Experience</Link></li>
                <li><Link to={ROUTES.SKILLS} className="hover:underline">Skills</Link></li>
                <li><Link to={ROUTES.CONTACT} className="hover:underline">Contact</Link></li>
            </ul>
        </nav>
        </div>
    </header>
)

export default Header