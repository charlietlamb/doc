import { AppOpenAPI } from '@doc/hono/lib/types'
import { apiReference } from '@scalar/hono-api-reference'

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      title: 'Doc API',
      version: '0.0.1',
      description: 'API for managing doctors and slots',
    },
    servers: [
      {
        url: '/api',
        description: 'API server',
      },
    ],
    tags: [
      {
        name: 'Doctors',
        description: 'Doctor management endpoints',
      },
      {
        name: 'Slots',
        description: 'Slot management endpoints',
      },
    ],
  })

  app.get(
    '/reference',
    apiReference({
      spec: { url: '/api/doc' },
      theme: 'bluePlanet',
      layout: 'classic',
      defaultHttpClient: {
        targetKey: 'javascript',
        clientKey: 'fetch',
      },
    })
  )
}
