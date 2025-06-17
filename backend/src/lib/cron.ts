import { CronJob } from 'cron'
import { notifyAboutMostLikedIdeas } from '../scripts/notifyAboutMostLikedIdeas'
import type { AppContext } from './ctx'
import { logger } from './logger'

export const applyCron = (ctx: AppContext) => {
  new CronJob(
    '0 10 1 * *',
    () => {
      notifyAboutMostLikedIdeas({ ctx }).catch((error) => {
        logger.error('cron', error)
      })
    },
    null,
    true
  )
}
