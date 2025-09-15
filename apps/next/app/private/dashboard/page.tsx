'use client'
import { authClient } from 'lib/auth-client'
import React from 'react'

const Dashboard = () => {
  const session = authClient.useSession()
  console.log('session', session)
  return <div>Dashboard</div>
}

export default Dashboard
