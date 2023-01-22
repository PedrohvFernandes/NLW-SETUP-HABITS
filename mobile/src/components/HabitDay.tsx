import {
  TouchableOpacity,
  TouchableOpacityProps,
  Dimensions
} from 'react-native'
import { generateProgressPercentage } from '../utils/generate-progress-percentage'
import clsx from 'clsx'
import dayjs from 'dayjs'

const WEEK_DAYS = 7
const SCREEN_HORIZONTAL_PADDING = (32 * 2) / 5

export const DAY_MARGIN_BETWEEN = 8
export const DAY_SIZE =
  Dimensions.get('screen').width / WEEK_DAYS - (SCREEN_HORIZONTAL_PADDING + 5)

interface Props extends TouchableOpacityProps {
  amountOfHabit?: number
  amoutOfCompletedHabits?: number
  date: Date
}

export function HabitDay({
  amountOfHabit = 0,
  amoutOfCompletedHabits = 0,
  date,
  ...rest
}: Props) {
  const progressPercentage =
    amountOfHabit > 0
      ? generateProgressPercentage(amountOfHabit, amoutOfCompletedHabits)
      : 0

  const today = dayjs().startOf('day').toDate()
  const isCurrentDay = dayjs(date).isSame(today)
  
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      className={clsx('rounded-lg border-2 m-1', {
        [`bg-zinc-900 border-zinc-800`]: progressPercentage === 0,
        ['bg-violet-900 border-violet-700']:
          progressPercentage > 0 && progressPercentage < 20,
        ['bg-violet-800 border-violet-600']:
          progressPercentage > 20 && progressPercentage < 40,
        ['bg-violet-700 border-violet-500']:
          progressPercentage > 40 && progressPercentage < 60,
        ['bg-violet-600 border-violet-500']:
          progressPercentage > 60 && progressPercentage < 80,
        ['bg-violet-500 border-violet-400']: progressPercentage > 80,
        ['border-white border-4 ']: isCurrentDay
      })}
      style={{ width: DAY_SIZE, height: DAY_SIZE }}
      {...rest}
    />
  )
}
