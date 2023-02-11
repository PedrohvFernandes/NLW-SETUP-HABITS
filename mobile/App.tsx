import './src/lib/dayjs'
import { Button, StatusBar } from 'react-native'
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold
} from '@expo-google-fonts/inter'

import * as Notifications from 'expo-notifications'
import { Loading } from './src/components/Loading'
import { Routes } from './src/routes'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true
  })
})

export default function App() {
  const [fontsLoading] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold
  })

  async function scheduleNotification() {
    const trigger = new Date(Date.now())
    trigger.setMinutes(trigger.getMinutes() + 1)

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Hey, look at that!',
        body: 'Você praticou seus habitos hoje?'
      },
      trigger
    })
  }

  async function getScheduledNotifications() {
    const schedules = await Notifications.getAllScheduledNotificationsAsync()

    console.log(schedules)
  }

  if (!fontsLoading) {
    return <Loading />
  }

  return (
    <>
      <Button title="Enviar" onPress={scheduleNotification} />
      <Button title="Get notification agendada" onPress={getScheduledNotifications} />
      <Routes />
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
    </>
  )
}
