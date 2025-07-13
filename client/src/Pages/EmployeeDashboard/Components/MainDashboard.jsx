import React from 'react'
import SystemHealthCards from './systemHealthCards'


const mainDashboard = () => {
  return (
     <div className="p-6 min-h-screen bg-white rounded-lg text-black">
      <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent mb-6">
        Dashboard Overview
      </h1>
      <SystemHealthCards />
     
    </div>
  )
}

export default mainDashboard