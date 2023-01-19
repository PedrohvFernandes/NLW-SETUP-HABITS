import dayjs from 'dayjs'
import { FastifyInstance } from 'fastify'
import { z } from 'zod'
import { prisma } from './lib/prisma'

export async function appRoute(app: FastifyInstance) {
  // Declare a route
  // A rota get é a unica que conseguimos utilizar, usando somente o navegador ao entrar na rota, sem nenhum tipo de operação.
  // app.get('/', async () => {
  //   const habits = await prisma.habit.findMany({
  //     where: {
  //       title: 'Estudar'
  //     }
  //   })
  //   console.log(habits)
  //   return habits
  // })

  app.post('/habits', async request => {
    const createHabitBody = z.object({
      title: z.string(),
      weekDays: z.array(z.number().min(0).max(6))
    })
    const { title, weekDays } = createHabitBody.parse(request.body)

    // data atual com o horario zerado 00:00:00(startOf), dessa forma quando a pessoa criar o habito dia 10(terça-feira) de janeiro as 14 horas, e ele colocou na recorrencia para as terças e quartas, ja vai estar liberado na quele mesmo dia para ele realizar esse habit
    const today = dayjs().startOf('day').toDate()
    await prisma.habit.create({
      data: {
        title,
        created_at: today,
        weekDays: {
          create: weekDays.map(weekDay => {
            return {
              week_day: weekDay
            }
          })
        }
      }
    })
  })

  app.get('/day', async request => {
    const getDayParams = z.object({
      date: z.coerce.date()
    })
    const { date } = getDayParams.parse(request.query)

    const parseDate = dayjs(date).startOf('day')
    console.log(parseDate)
    const weekDay = parseDate.get('day')
    console.log(weekDay)

    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          lte: date
        },
        weekDays: {
          some: {
            week_day: weekDay
          }
        }
      }
    })
    const day = await prisma.day.findUnique({
      where: {
        date: parseDate.toDate()
      },
      include: {
        dayHabits: true
      }
    })
    const completedHabits = day?.dayHabits.map(dayHabit => {
      return dayHabit.habit_id
    })
    return {
      possibleHabits,
      completedHabits
    }
  })
}
