import React from 'react'
import Section from 'Components/Section'
import Card from 'Components/card/Card'

const FeaturedExperiences: React.FC = () => (
    <Section header="Featured Experience">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card header="Akido Labs Clinical Platform">
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
                    {', built TypeScript features across a multi-repository, FHIR-based clinical platform using Next.js, React, NestJS, Node.js, GraphQL, PostgreSQL, and Kafka.'}
                </p>
            </Card>
            <Card header="AI-Assisted Engineering">
                <p>
                    Create reusable prompts, skills, and multi-step agent flows with
                    validation and retry loops, while keeping context and token usage lean.
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
                    {' launch while serving as a senior engineer at '}
                    <a
                        href="https://www.a2zsync.com"
                        className="underline link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        A2Z Sync
                    </a>
                    .
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
                    {', including shared component libraries, performance improvements, and CRM integrations.'}
                </p>
            </Card>
            <Card header="A2Z Online Digital Retail">
                <p>
                    {'Built features for the '}
                    <a
                        href="https://a2zsync.com/online/"
                        className="underline link"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        A2Z Sync online platform
                    </a>
                    {', including credit-application integrations with multiple bureaus and lending providers.'}
                </p>
            </Card>
        </div>
    </Section>
)

export default FeaturedExperiences
