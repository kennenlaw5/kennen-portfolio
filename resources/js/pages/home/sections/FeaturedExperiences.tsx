import React from 'react'
import Section from 'Components/Section'
import Card from 'JS/components/Card'

const FeaturedExperiences: React.FC = () => (
    <Section header="Featured Experience">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className='md:col-span-2 lg:col-span-1' header="Amazon Autos Partnership">
                <p>
                    {'Played a pivotal role in launching '}
                    <a
                        href="https://www.amazon.com/Amazon-Autos/b?ie=UTF8&node=10677469011"
                        className="underline hover:text-blue-500"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Amazon Autos
                    </a>
                    {' at '}
                    <a
                        href="https://www.a2zsync.com"
                        className="underline hover:text-blue-500"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        A2Z Sync
                    </a>
                    , establishing the company as a market leader.
                </p>
            </Card>
            <Card header="Scalable React Libraries">
                <p>
                    Designed reusable React components that optimized UI performance,
                    reducing load times by up to 50%.
                </p>
            </Card>
            <Card header="Legacy Code Modernization">
                <p>
                    Led efforts to refactor and modernize legacy systems, 
                    improving maintainability and performance.
                </p>
            </Card>
        </div>
    </Section>
)

export default FeaturedExperiences
