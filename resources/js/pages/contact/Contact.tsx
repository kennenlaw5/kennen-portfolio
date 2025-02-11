import React from 'react'
import Section from 'Components/Section'
import ContactDetails from 'JS/pages/contact/sections/ContactDetails'
import Card from 'Components/card/Card'

const Contact: React.FC = () => {
  return (
    <Section header="Contact Me" subHeader="Get in touch with me!">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ContactDetails />
        <div className="mt-8">
          <h4 className="font-bold mb-4">Frequently Asked Questions</h4>
          <Card className='mb-4' subHeader="What's your preferred method of communication?" isDropDown>
            <p className="mt-3 text-gray-600">Email is usually best, but I'm also responsive on LinkedIn.</p>
          </Card>
          <Card subHeader="Are you open to freelance work?" isDropDown>
            <p className="mt-3 text-gray-600">Yes, I'm always interested in discussing new opportunities.</p>
          </Card>
        </div>
      </div>
    </Section>
  )
}

export default Contact
