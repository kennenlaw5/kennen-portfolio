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
                        <a
                            href={certificate.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 rounded-xl bg-white/90 p-2 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                        >
                            <img src={certificate.image} alt={certificate.alt} className="w-20 h-20 object-contain" />
                        </a>
                        <p>{certificate.description}</p>
                    </div>
                </Card>
            ))}
        </div>
    </Section>
  )
}

export default Certificates
