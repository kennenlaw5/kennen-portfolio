import React from 'react'
import Card from 'Components/Card'
import Section from 'Components/Section'

const certificatesData = [
    {image: '/images/CompTIA-Security-Plus.png', text: 'In-Progress', alt: 'Security+ Certification Logo'},
    {image: '/images/CompTIA-Network-Plus.png', text: 'Todo', alt: 'Network+ Certification Logo'},
    {image: '/images/CompTIA-A-Plus.png', text: 'Todo', alt: 'A+ Certification Logo'},
]

const Certificates: React.FC = () => {
  return (
    <Section header="Certificates">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card header="CompTIA" subheader="- Curiosity-Driven IT Exploration">
                <div className="grid grid-cols-3 items-center justify-center">
                    {certificatesData.map((certificate, index) => (
                        <div key={index} className='flex flex-col items-center'>
                            <img src={certificate.image} alt={certificate.alt} className="w-24 h-24 object-contain" />
                            <p className="text-center text-gray-700">{certificate.text}</p>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    </Section>
  )
}

export default Certificates
