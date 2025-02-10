import React from 'react'
import Card from 'Components/Card'
import Section from 'Components/Section'
import {COMPTIA_CERTIFICATES, RECREATIONAL_CERTIFICATES} from 'Constants/certificates'

const Certificates: React.FC = () => {
  return (
    <Section header="Certificates">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card header="CompTIA" subheader="- Curiosity-Driven IT Exploration">
                <div className={`grid grid-cols-${COMPTIA_CERTIFICATES.length} items-center justify-center`}>
                    {COMPTIA_CERTIFICATES.map((certificate, index) => (
                        <div key={index} className='flex flex-col items-center'>
                            <a href={certificate.link} target="_blank" rel="noopener noreferrer">
                                <img src={certificate.image} alt={certificate.alt} className="w-24 h-24 object-contain" />
                            </a>
                            <p className="text-center text-gray-700">{certificate.text}</p>
                        </div>
                    ))}
                </div>
            </Card>
            <Card header="Passions & Pursuits" subheader="- Beyond The Keyboard">
                <div className={`grid grid-cols-${RECREATIONAL_CERTIFICATES.length} items-center justify-center`}>
                    {RECREATIONAL_CERTIFICATES.map((certificate, index) => (
                        <div key={index} className='flex flex-col items-center'>
                            <a href={certificate.link} target="_blank" rel="noopener noreferrer">
                                <img src={certificate.image} alt={certificate.alt} className="w-24 h-24 object-contain" />
                            </a>
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
