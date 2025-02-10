import React from 'react'
import Section from 'Components/Section'
import ContactDetails from 'JS/pages/contact/sections/ContactDetails'

const Contact: React.FC = () => {
  return (
    <Section header="Contact Me" subheader="Get in touch with me!">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ContactDetails />
        <div className="mt-8">
          <h4 className="font-bold mb-4">Frequently Asked Questions</h4>
          <details className="bg-white p-4 rounded shadow mb-2">
            <summary className="cursor-pointer select-none">What's your preferred method of communication?</summary>
            <p className="mt-3 text-gray-600">Email is usually best, but I'm also responsive on LinkedIn.</p>
          </details>
          <details className="bg-white p-4 rounded shadow mb-2">
            <summary className="cursor-pointer select-none">Are you open to freelance work?</summary>
            <p className="mt-3 text-gray-600">Yes, I'm always interested in discussing new opportunities.</p>
          </details>
        </div>
      </div>
    </Section>
  )
}

export default Contact
