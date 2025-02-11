import React from 'react'
import Linkedin from 'Components/contact/Linkedin'
import Email from 'Components/contact/Email'

const Footer = () => (
    <footer className="bg-gray-800 text-gray-300 py-4">
        <div className="container mx-auto text-center">
            <div className='flex justify-center items-center space-x-4 mt-2'>
                <Email />
                <span className='cursor-default select-none'>|</span>
                <Linkedin />
            </div>
            <p>&copy; {(new Date()).getFullYear()} Kennen Lawrence. All rights reserved.</p>
        </div>
    </footer>
)

export default Footer