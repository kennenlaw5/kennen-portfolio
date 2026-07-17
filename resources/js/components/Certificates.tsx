import React from 'react'
import Card from 'Components/card/Card'
import Section from 'Components/Section'
import {RECREATIONAL_CERTIFICATES} from 'Constants/certificates'

const Certificates: React.FC = () => {
  return (
    <Section header="Passions & Pursuits" subHeader="Beyond The Keyboard">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {RECREATIONAL_CERTIFICATES.map((certificate) => (
                <Card key={certificate.text} header={certificate.text}>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <a href={certificate.link} target="_blank" rel="noopener noreferrer">
                            <img src={certificate.image} alt={certificate.alt} className="w-24 h-24 object-contain" />
                        </a>
                        <p className="text-gray-700">{certificate.description}</p>
                    </div>
                </Card>
            ))}
        </div>
    </Section>
  )
}

export default Certificates
