import './bootstrap'
import React, {Suspense} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom'
import {HOME_ROUTE, ROUTES} from 'Constants/routes'
import Layout from 'Components/Layout'

const App: React.FC = () => {
    return (
        <Router>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                    <Route path={HOME_ROUTE.path} element={<Layout />}>
                        <Route index element={<HOME_ROUTE.component />} />
                        {Object.values(ROUTES).map((route) => (
                            <Route key={route.path} path={route.path} element={<route.component />} />
                        ))}
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

