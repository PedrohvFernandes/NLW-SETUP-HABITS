import fastify from 'fastify'
import cors from '@fastify/cors'
import { PrismaClient } from '@prisma/client'

const app = fastify()
const prisma = new PrismaClient()

app.register(cors, {
  origin: '*'
})

// Declare a route
// A rota get é a unica que conseguimos utilizar, usando somente o navegador ao entrar na rota, sem nenhum tipo de operação.
app.get('/', async () => {
  const habits = await prisma.habit.findMany({
    where: {
      title: 'Estudar'
    }
  })
  console.log(habits)
  return habits
})

app.listen(
  {
    port: 3333
  },
  (err, address) => {
    if (err) {
      console.error(err)
    }
    console.log(`Server listening at ${address}`)
  }
)
