import * as Checkbox from '@radix-ui/react-checkbox'
import dayjs from 'dayjs'
import { Check } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { api } from '../lib/axios'

interface HabitListProps {
  date: Date
  onCompletedChanged: (completed: number) => void
}

interface HabitsInfo {
  possibleHabits: Array<{
    id: string
    title: string
    created_at: string
  }>
  completedHabits: string[]
}

export function HabitList({ date, onCompletedChanged }: HabitListProps) {
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>()

  useEffect(() => {
    api
      .get('day', {
        params: {
          date: date.toISOString()
        }
      })
      .then(response => setHabitsInfo(response.data))
  }, [])

  async function handleToggleHabit(habitId: string) {
    await api.patch(`/habits/${habitId}/toggle`)

    const isHabitAlreadyCompleted =
      habitsInfo?.completedHabits.includes(habitId)

    let completedHabits: string[] = []

    if (isHabitAlreadyCompleted) {
      completedHabits = habitsInfo!.completedHabits.filter(id => id !== habitId)
    } else {
      completedHabits = [...habitsInfo!.completedHabits, habitId]
    }
    setHabitsInfo({
      possibleHabits: habitsInfo!.possibleHabits,
      completedHabits
    })

    onCompletedChanged(completedHabits.length)
  }
  const isDateInPast = dayjs(date).endOf('day').isBefore(new Date(), 'day')

  return (
    <div className="mt-6 flex flex-col gap-3">
      {habitsInfo?.possibleHabits.map((habit, index) => {
        return (
          <Checkbox.Root
            key={habit.id + index}
            className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-bg hover:outline-none hover:ring-2 hover:ring-violet-700 hover:ring-offset-2 hover:ring-offset-bg transition-all duration-300 hover:p-2 focus:p-2 disabled:cursor-not-allowed rounded-lg"
            checked={habitsInfo?.completedHabits.includes(habit.id)}
            onCheckedChange={() => handleToggleHabit(habit.id)}
            disabled={isDateInPast}
          >
            <div className="h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-900 transition-all duration-300 group-focus:outline-none group-focus:ring-2 group-focus:ring-violet-700 group-focus:ring-offset-2 group-focus:ring-offset-bg group-hover:outline-none group-hover:ring-2 group-hover:ring-violet-700 group-hover:ring-offset-2 group-hover:ring-offset-bg">
              <Checkbox.Indicator>
                <Check size={20} className="text-white" />
              </Checkbox.Indicator>
            </div>
            <span className="font-semibold text-xl text-white leading-tight group-data-[state=checked]:line-through group-data-[state=checked]:text-zinc-400">
              {habit.title}
            </span>
          </Checkbox.Root>
        )
      })}
    </div>
  )
}
