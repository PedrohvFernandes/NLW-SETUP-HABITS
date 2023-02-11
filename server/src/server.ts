import cors from '@fastify/cors'
import fastify from 'fastify'
import { notificationsRoutes } from './notifications-routes'
import { appRoute } from './route'

const app = fastify()

app.register(cors, {
  origin: '*'
})
app.register(appRoute)
app.register(notificationsRoutes)

app.listen(
  {
    port: 3333,
    host: '0.0.0.0'
  },
  (err, address) => {
    if (err) {
      console.error(err)
    }
    console.log(`Server listening at ${address}`)
  }
)
