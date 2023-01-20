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

  // essa rota cria um novo habito
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

  // Essa rota retorna os habitos que a pessoa pode realizar, e os habitos que ela ja realizou de um dia só, ou seja, no dia/naquele dia
  app.get('/day', async request => {
    const getDayParams = z.object({
      date: z.coerce.date()
    })
    const { date } = getDayParams.parse(request.query)

    // Data passada via request.query, convertida
    const parseDate = dayjs(date).startOf('day')
    console.log(parseDate)

    // Dia da semana 0(domingo) a 6(Sábado)
    const weekDay = parseDate.get('day')
    console.log(weekDay)

    // Possiveis habitos que a pessoa pode realizar no dia de acordo com os dois where
    const possibleHabits = await prisma.habit.findMany({
      where: {
        created_at: {
          // lte: menor ou igual a data que foi passada. Porque esse habit não pode aparecer/completado se a pessoa criou ele depois da data que foi passada
          lte: date
        },
        // E some: algum dos dias da semana que a pessoa colocou na recorrencia. Se ela colocou na recorrencia para as terças e quartas, e hoje for terça, vai retornar o hábito, se for quarta, vai retornar, se for outro dia, não vai retornar
        weekDays: {
          some: {
            week_day: weekDay
          }
        }
      }
    })

    // Habit que a pessoa ja realizou ou não no/naquele dia
    const day = await prisma.day.findUnique({
      where: {
        date: parseDate.toDate()
      },
      include: {
        dayHabits: true
      }
    })

    // Habit que a pessoa ja realizou ou não(?) no/naquele dia
    const completedHabits = day?.dayHabits.map(dayHabit => {
      return dayHabit.habit_id
    })

    return {
      possibleHabits,
      completedHabits
    }
  })

  // Completar / descompletar um habito - mudar um status de um habito se esta completo ou não
  app.patch('/habits/:id/toggle', async (request, reply) => {
    // route Param :AlgumParametro dentro da rota => parametro de identificação

    const toggleHabitParams = z.object({
      id: z.string().uuid()
    })

    const { id } = toggleHabitParams.parse(request.params)

    const today = dayjs().startOf('day').toDate()

    // Compara se o dia existe, se não existir, cria um novo dia(referencia) na tabela days com os habitos completados(marcados) naquele dia
    let day = await prisma.day.findUnique({
      where: {
        date: today
      }
    })

    if (!day) {
      day = await prisma.day.create({
        data: {
          date: today
        }
      })
    }

    // Verifica se o habito ja foi completado no dia, se sim e ele clicou novamente no botão de completar, ele vai deletar a relação entre o dia e o habito, ou seja, ele vai desmarcar o habito como completo no dia
    const dayHabit = await prisma.dayHabit.findUnique({
      where: {
        day_id_habit_id: {
          day_id: day.id,
          habit_id: id
        }
      }
    })

    if (dayHabit) {
      // deleta a relação entre o dia e o habito. Ou seja você desmarca um habito como completo no dia
      await prisma.dayHabit.delete({
        where: {
          id: dayHabit.id
        }
      })
    } else {
      // cria uma nova relação entre o dia e o habito. Ou seja você marca um habito como completo no dia
      await prisma.dayHabit.create({
        data: {
          day_id: day.id,
          habit_id: id
        }
      })
    }
  })

  // Essa rota retorna todos os habitos que a pessoa criou. Obs: essa rota não usa mais o ORM Prisma. Ou seja, tudo que fizermos aqui é SQL na mão, voltado para o SQLite(SGBD)
  app.get('/summary', async () => {
    // O que ela vai retornar: [ {date: 17/01, PossiveisHabit(amount): 5, Habitcompleted: 1 }, {date: 18/01, PossiveisHabit: 2, Habitcompleted: 2 } , {...}]
    // Query mais complexa, mais condições, relacionamentos ==> SQL na mão (raw query)
    // Prisma ORM: Raw SQL ==> SQLite

    // Essa query retorna todos os days que foram cadastrados no sistema:
    // const summary = await prisma.$queryRaw`
    //   SELECT * FROM days
    // `

    const summary = await prisma.$queryRaw`
      SELECT 
        D.id, 
        D.date,
        (
          SELECT 
            cast(COUNT(*) as float)
          FROM day_habits DH
          WHERE DH.day_id = D.id
        ) as completed_habits,
        (
          SELECT
            cast(COUNT(*) as float)
          FROM habit_week_days HWD
          JOIN habits H 
            ON H.id = HWD.habit_id
          WHERE
            HWD.week_day = cast(STRFTIME('%w', D.date/1000.0, 'unixepoch') as int)
            AND H.created_at <= D.date
        ) as amount
      FROM days D
    `
    return summary
  })
}
