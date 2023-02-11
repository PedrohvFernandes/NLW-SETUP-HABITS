self.addEventListener('push', function (event) {
  const body = event.data?.text() ?? 'No payload'

  console.log(body)
  event.waitUntil(
    self.registration.showNotification('Habits', {
      body
    })
  )
})
