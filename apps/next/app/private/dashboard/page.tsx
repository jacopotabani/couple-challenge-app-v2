'use client'
import { authClient } from 'lib/auth-client'
import React from 'react'
import { DashboardScreen } from '@my/app/features/dashboard/screen'

const Dashboard = () => {
  const session = authClient.useSession()
  console.log('session', session)
  return <DashboardScreen />
}

export default Dashboard
