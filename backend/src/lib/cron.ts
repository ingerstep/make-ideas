import { CronJob } from 'cron'
import { notifyAboutMostLikedIdeas } from '../scripts/notifyAboutMostLikedIdeas'
import type { AppContext } from './ctx'

export const applyCron = (ctx: AppContext) => {
  new CronJob(
    '0 10 1 * *',
    () => {
      notifyAboutMostLikedIdeas(ctx).catch(console.error)
    },
    null,
    true
  )
}
