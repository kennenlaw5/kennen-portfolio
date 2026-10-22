import React from 'react'
import Section from 'Components/Section'
import Card from 'Components/card/Card'

const FeaturedExperiences: React.FC = () => (
    <Section header="Featured Experience">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card header="Custom Business Solutions for Schomp Automotive" className="col-span-full">
                <p>
                    Developed custom scripting solutions for Schomp Automotive to automate
                    data ingestion and analysis, translating business needs into practical
                    tools for day-to-day operations.
                </p>
            </Card>
            <Card header="Amazon Autos at A2Z Sync">
                <p>
                    {'Built inventory syndication and pricing integrations for the historical '}
                    <a
                        href="https://www.amazon.com/Amazon-Autos/b?ie=UTF8&node=10677469011"
                        className="underline link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Amazon Autos
                    </a>
                    {' launch, keeping vehicle and pricing data accurate for thousands of vehicles across hundreds of dealerships.'}
                </p>
            </Card>
            <Card header="A2Z In-Store Platform">
                <p>
                    {'Built and optimized React experiences for the '}
                    <a
                        href="https://a2zsync.com/in-store/"
                        className="underline link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        A2Z Sync in-store platform
                    </a>
                    {', including shared component libraries and CRM integrations, as it grew from seven dealership rooftops to hundreds nationwide.'}
                </p>
            </Card>
            <Card header="A2Z Online Digital Retail">
                <p>
                    {'Owned credit-application integrations with multiple bureaus and lending providers for the '}
                    <a
                        href="https://a2zsync.com/online/"
                        className="underline link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        A2Z Sync online platform
                    </a>
                    {', which became a Mazda Digital Certified Retail provider.'}
                </p>
            </Card>
            <Card header="Help Desk to Senior Engineer">
                <p>
                    {'Spent seven years at '}
                    <a
                        href="https://www.a2zsync.com"
                        className="underline link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        A2Z Sync
                    </a>
                    {' and was promoted three times, improving React UI load times by up to 50% and mentoring teammates through pairing and code reviews.'}
                </p>
            </Card>
            <Card header="57% Faster CI at Engrain">
                <p>
                    {'At '}
                    <a
                        href="https://www.engrain.com/"
                        className="underline link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Engrain
                    </a>
                    {', reduced CI build time from 46 minutes to 20 minutes by changing the test strategy and allocating build resources more efficiently.'}
                </p>
            </Card>
            <Card header="AI Adoption at Akido Labs">
                <p>
                    {'At '}
                    <a
                        href="https://www.akidolabs.com/"
                        className="underline link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Akido Labs
                    </a>
                    {', helped guide AI adoption and built custom skills and tools for more reliable, useful, and cost-effective engineering output, keeping the approach agent agnostic as AI tooling evolves.'}
                </p>
            </Card>
        </div>
    </Section>
)

export default FeaturedExperiences
