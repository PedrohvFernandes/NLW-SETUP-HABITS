import { generateDatesFromYearBeginning } from '../utils/generate-dates-from-year-beginning'
import { HabitDay } from './HabitDay'

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const summaryDates = generateDatesFromYearBeginning()
console.log(summaryDates)

// quanto de quadradinhos pra preencher o restante do calendário para não deixar feio
const minimumSummaryDatesSize = 18 * 7 // 18 weeks
// De acordo com o tamanho do array de datas, eu preciso de quantos quadradinhos pra preencher o calendário. Diminuindo a quantidade de quadradinhos eu preciso para preencher com o tamanho do array de datas
const amountOfDatesToFill = minimumSummaryDatesSize - summaryDates.length

export function SummaryTable() {
  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((day, index) => (
          <div
            key={`${day}-${index}`}
            className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-rows-7 grid-flow-col gap-3">
        {summaryDates.map((date, index) => (
          <HabitDay key={`${date.toString()}-${index}`} />
        ))}

        {/* {Array(amountOfDatesToFill)
          .fill(0)
          .map((_, index) => (
            <div
              key={`empty-${index}`}
              className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg flex items-center justify-center text-center"
            />
      ))} */}

        {amountOfDatesToFill > 0 &&
        // Um array com a quantidade de elementos vazios que eu preciso para preencher o calendário
          Array.from({ length: amountOfDatesToFill }).map((_, index) => {
            return (
              <div
                className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg flex items-center justify-center text-center opacity-40 cursor-not-allowed"
                key={`empty-${index}`}
              ></div>
            )
          })}
      </div>
    </div>
  )
}
