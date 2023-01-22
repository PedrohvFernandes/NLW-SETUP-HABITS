import { useState, useEffect } from 'react'
import { View, ScrollView, Text, Alert } from 'react-native'
import { useRoute } from '@react-navigation/native'
import { BackButton } from '../components/BackButton'
import dayjs from 'dayjs'
import { ProgressBar } from '../components/ProgressBar'
import { Checkbox } from '../components/Checkbox'
import { Loading } from '../components/Loading'
import { HabitsEmpty } from '../components/HabitsEmpty'
import { api } from '../lib/axios'
import { generateProgressPercentage } from '../utils/generate-progress-percentage'
import clsx from 'clsx'

interface Params {
  date: string
}

interface DayInfoProps {
  completedHabits: string[]
  possibleHabits: {
    id: string
    title: string
  }[]
}

export function Habit() {
  const [loading, setLoading] = useState(true)
  const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null)
  const [completedHabits, setCompletedHabits] = useState<string[]>([])

  const route = useRoute()
  const { date } = route.params as Params

  const parseDate = dayjs(date)
  const isDateInPast = parseDate.endOf('day').isBefore(new Date())
  const dayOfWeek = parseDate.format('dddd')
  const dayOfMonth = parseDate.format('DD/MM')

  const habitsProgress = dayInfo?.possibleHabits.length
    ? generateProgressPercentage(
        dayInfo.possibleHabits.length,
        completedHabits.length
      )
    : 0

  async function fetchHabits() {
    try {
      setLoading(true)
      const response = await api.get('/day', {
        params: {
          date
        }
      })
      setDayInfo(response.data)
      setCompletedHabits(response.data.completedHabits)
    } catch (err) {
      console.log(err)
      Alert.alert(
        'Ops 😳',
        'Não foi possível carregar as informações dos hábitos.'
      )
    } finally {
      setLoading(false)
    }
  }

  async function handleToggleHabit(habitId: string) {
    try {
      await api.patch(`/habits/${habitId}/toggle`)

      const isHabitAlreadyCompleted = completedHabits.includes(habitId)

      let newCompletedHabits: string[] = []

      if (isHabitAlreadyCompleted) {
        newCompletedHabits = completedHabits.filter(id => id !== habitId)
      } else {
        newCompletedHabits = [...completedHabits, habitId]
      }
      setCompletedHabits(newCompletedHabits)
    } catch (err) {
      console.log(err)
      Alert.alert(
        'Ops 😳',
        'Não foi possível atualizar o hábito. Tente novamente.'
      )
    }
  }

  useEffect(() => {
    fetchHabits()
  }, [])

  if (loading) return <Loading />

  return (
    <View className="flex-1 bg-background px-8 pt-16">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />
        <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
          {dayOfWeek}
        </Text>
        <Text className="text-white font-extrabold text-3xl">{dayOfMonth}</Text>
        <ProgressBar progress={habitsProgress} />

        <View className={clsx("mt-6",
          { 'opacity-50': isDateInPast}
          )}>
          {dayInfo?.possibleHabits ? (
            dayInfo?.possibleHabits.map((habit, index) => {
              return (
                <Checkbox
                  key={index + habit.title}
                  title={habit.title}
                  checked={completedHabits.includes(habit.id)}
                  disabled={isDateInPast}
                  onPress={() => handleToggleHabit(habit.id)}
                />
              )
            })
          ) : (
            <HabitsEmpty />
          )}
        </View>

        {
          isDateInPast && (
            <Text className='text-white mt-10 text-center'>
              Você não pode  marcar ou desmarcar(editar) mais hábitos de dias passados. 🫤
            </Text>
          )
        }
      </ScrollView>
    </View>
  )
}
