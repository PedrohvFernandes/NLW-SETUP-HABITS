import { Text, View, ScrollView, Alert } from 'react-native'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { useState, useCallback } from 'react'

import { api } from '../lib/axios'
import { generateDatesFromYearBeginning } from '../utils/generate-dates-from-year-beginning'

import { HabitDay, DAY_SIZE } from '../components/HabitDay'
import { Header } from '../components/Header'
import { Loading } from '../components/Loading'
import dayjs from 'dayjs'

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const datesFromYearStart = generateDatesFromYearBeginning()
const minimumSummaryDatesSizes = 18 * 7
const amountOfDatesToFill = minimumSummaryDatesSizes - datesFromYearStart.length

type Summary = Array<{
  id: string
  date: string
  amount: number
  completed_habits: number
}>

export function Home() {
  const { navigate } = useNavigation()
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState<Summary | null>([])

  async function fetchData() {
    try {
      setLoading(true)
      const response = await api.get('/summary')
      setSummary(response.data)
      console.log(response.data)
    } catch (error) {
      Alert.alert('Ops 😳', 'Não foi possível carregar o sumário de hábitos.')
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchData()
    }, [])
  )

  if (loading) {
    return <Loading />
  }

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <Header />
      <View className="flex-row mt-6 mb-2">
        {weekDays.map((day, index) => (
          <Text
            key={`${day}-${index}`}
            className="text-zinc-400 text-xl font-bold text-center mx-1"
            style={{ width: DAY_SIZE }}
          >
            {day}
          </Text>
        ))}
      </View>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {summary && (
          <View className="flex-row flex-wrap">
            {datesFromYearStart.map((date, index) => {
              const dayWithHabit = summary.find(day => {
                return dayjs(date).isSame(dayjs(day.date, 'day'))
              })

              return (
                <HabitDay
                  key={`${date}-${index}`}
                  date={date}
                  amountOfHabit={dayWithHabit?.amount}
                  amoutOfCompletedHabits={dayWithHabit?.completed_habits}
                  onPress={() =>
                    navigate('Habit', { date: date.toISOString() })
                  }
                />
              )
            })}

            {amountOfDatesToFill > 0 &&
              Array.from({ length: amountOfDatesToFill }).map((_, index) => (
                <View
                  className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                  style={{ width: DAY_SIZE, height: DAY_SIZE }}
                  key={`${index}`}
                />
              ))}
          </View>
        )}
      </ScrollView>
    </View>
  )
}
