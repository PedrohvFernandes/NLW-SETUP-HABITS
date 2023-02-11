import { FastifyInstance } from 'fastify'
import WebPush from 'web-push'
import { z } from 'zod'

console.log(WebPush.generateVAPIDKeys())
const publicKey = 'BI9sXVM-U-HyKl4noiHiWMmzrl_xOSff7Kpd0QcrXv-DxhJIhVP5zer8kI30sUvM5RsFR7firaNoAgUkaCU7dPg'
const privateKey = 'yda1oCvxs85YuYoepCYj2i9bwKpLyuDlnv9ZitIqMk8'

WebPush.setVapidDetails('http://localhost:3333', publicKey, privateKey)

export async function notificationsRoutes(app: FastifyInstance) {
  app.get('/push/public_key', async (request, reply) => {
    return {
      publicKey
    }
  })

  app.post('/push/register', (request, reply) => {
    // console.log(request.body)
    return reply.status(201).send()
  })

  app.post('/push/send', async (request, reply) => {
    const sendPushBody = z.object({
      subscription: z.object({
        endpoint: z.string(),
        keys: z.object({
          p256dh: z.string(),
          auth: z.string()
        })
      })
    })
    const { subscription } = sendPushBody.parse(request.body)

    setTimeout(() => {
      WebPush.sendNotification(subscription, 'Hello World Back')
    }, 5000)

    return reply.status(201).send()
  })
}
