// eslint-disable-next-line import/order
import { env } from './lib/env'
import cors from 'cors'
import express from 'express'
import { applyCron } from './lib/cron'
import { type AppContext, creatAppContext } from './lib/ctx'
import { logger } from './lib/logger'
import { applyPassportToExpressApp } from './lib/passport'
import { applyTrpcToExpressApp } from './lib/trpc'
import { trpcRouter } from './router'
import { presetDb } from './scripts/presetDb'
import { initSentry } from './lib/sentry'
import { applyServeWebApp } from './lib/serveWebApp'

void (async () => {
  let ctx: AppContext | null = null
  try {
    initSentry()
    ctx = creatAppContext()
    await presetDb(ctx)
    const expressApp = express()
    expressApp.use(cors())
    expressApp.get('/ping', (req, res) => {
      res.send('pong')
    })
    applyPassportToExpressApp(expressApp, ctx)
    applyTrpcToExpressApp(expressApp, ctx, trpcRouter)
    applyCron(ctx)
    await applyServeWebApp(expressApp)
    expressApp.use((error: unknown, req: express.Request, res: express.Response, next: express.NextFunction) => {
      logger.error('express', error)
      if (res.headersSent) {
        next(error)
        return
      }
      res.status(500).send('Internal Server Error')
    })
    expressApp.listen(env.PORT, () => {
      logger.info('express', `Listening on http://localhost:${env.PORT}`)
    })
  } catch (error) {
    logger.error('app', error)
    await ctx?.stop()
  }
})()
