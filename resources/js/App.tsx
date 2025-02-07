import './bootstrap'
import React, {lazy, Suspense} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {ROUTES} from 'Constants/routes'
import Layout from 'Components/Layout'

const Contact = lazy(() => import('JS/pages/contact/Contact'))
const Experience = lazy(() => import('JS/pages/Experience'))
const Games = lazy(() => import('JS/pages/Games'))
const Home = lazy(() => import('JS/pages/home/Home'))
const Projects = lazy(() => import('JS/pages/Projects'))
const Skills = lazy(() => import('JS/pages/Skills'))

const App: React.FC = () => {
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path={ROUTES.HOME} element={<Layout />}>
                        <Route index element={<Home />} />
                        <Route path={ROUTES.GAMES} element={<Games />} />
                        <Route path={ROUTES.PROJECTS} element={<Projects />} />
                        <Route path={ROUTES.EXPERIENCE} element={<Experience />} />
                        <Route path={ROUTES.SKILLS} element={<Skills />} />
                        <Route path={ROUTES.CONTACT} element={<Contact />} />
                    </Route>
                </Routes>
            </Suspense>
        </Router>
    )
}

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(<App />)
}

