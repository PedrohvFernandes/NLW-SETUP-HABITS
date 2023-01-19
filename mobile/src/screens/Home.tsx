import { Text, View, ScrollView } from 'react-native'

import { generateDatesFromYearBeginning } from '../utils/generate-dates-from-year-beginning'

import { HabitDay, DAY_SIZE } from '../components/HabitDay'
import { Header } from '../components/Header'

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']
const datesFromYearStart = generateDatesFromYearBeginning()
const minimumSummaryDatesSizes = 18 * 7
const amountOfDatesToFill = minimumSummaryDatesSizes - datesFromYearStart.length

export function Home() {
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
        <View className="flex-row flex-wrap">
          {datesFromYearStart.map((date, index) => (
            <HabitDay key={`${date}-${index}`} />
          ))}

          {amountOfDatesToFill > 0 &&
            Array.from({ length: amountOfDatesToFill }).map((_, index) => (
              <View
                className="bg-zinc-900 rounded-lg border-2 m-1 border-zinc-800 opacity-40"
                style={{ width: DAY_SIZE, height: DAY_SIZE }}
                key={`${index}`}
              />
            ))}
        </View>
      </ScrollView>
    </View>
  )
}
