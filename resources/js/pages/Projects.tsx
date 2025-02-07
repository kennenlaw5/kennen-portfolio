import React from 'react'

const Projects: React.FC = () => {
  return (
    <>
      <div className="p-8">
        <h1 className="text-3xl font-bold">Projects</h1>
        <p className="mt-4">
          Here are some projects that highlight my skills and achievements.
        </p>
        {/* Insert project cards or details here */}
      </div>
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4">My Projects</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white shadow rounded p-4">
                <h2 className="text-xl font-semibold">Project One</h2>
                <p className="mt-2 text-gray-600">
                    Description of Project One. This project demonstrates ...
                </p>
            </div>
        </div>
      </div>
    </>
  )
}

export default Projects;
