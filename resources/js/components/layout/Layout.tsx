import React from 'react'
import {Outlet} from 'react-router-dom'
import Footer from 'Components/layout/Footer'
import Header from './Header'

const Layout = () => (
    <div className="flex flex-col min-h-screen">
        <Header />
        <main className="container mx-auto mt-6 flex-grow px-4">
            <Outlet />
        </main>
        <Footer />
    </div>
)

export default Layout