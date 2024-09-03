import React from 'react'
import { Link } from 'react-router-dom'
import { Button, Heading } from '../../components'

function PageNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg text-center">
        <Heading>404: Page Not Found</Heading>
        <p className="mb-4">Oops! The page you're looking for doesn't exist.</p>
        <Link to="/">
          <Button className="bg-blue-500 hover:bg-blue-700 text-white">
            Go to Home
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default PageNotFound