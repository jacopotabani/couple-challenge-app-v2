'use client'
import { Text, View } from '@my/ui'
import { SafeAreaView } from 'react-native-safe-area-context'

const Dashboard = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom', 'left', 'right', 'top']}>
      <View>
        <Text>Dashboard</Text>
      </View>
    </SafeAreaView>
  )
}

export default Dashboard
