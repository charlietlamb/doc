import createApp from '@doc/hono/lib/create-app'
import doc from '@doc/hono/routes/doc/doc.index'
import configure from '@doc/hono/lib/configure'

const app = createApp()

configure(app)
const routes = [doc] as const

routes.forEach((route) => {
  app.route('/', route)
})

export default app

export type AppType = (typeof routes)[number]
export type TestType = { test: string }
export type App = typeof app
