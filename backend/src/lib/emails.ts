import { promises as fs } from 'fs'
import path from 'path'
import { getNewIdeaRoute, getViewIdeaRoute } from '@make-ideas/webapp/src/lib/routes'
import type { Idea, User } from '@prisma/client'
import fg from 'fast-glob'
import Handlebars from 'handlebars'
import _ from 'lodash'
import { sendEmailThroughBrevo } from './brevo'
import { env } from './env'
import { logger } from './logger'

const getHbrTemplates = _.memoize(async () => {
  const htmlPathsPattern = path.resolve(__dirname, '../emails/**/*.html')
  const htmlPaths = fg.sync(htmlPathsPattern)
  const hbrTemplates: Record<string, HandlebarsTemplateDelegate> = {}
  for (const htmlPath of htmlPaths) {
    const templateName = path.basename(htmlPath, '.html')
    const htmlTemplate = await fs.readFile(htmlPath, 'utf8')
    hbrTemplates[templateName] = Handlebars.compile(htmlTemplate)
  }
  return hbrTemplates
})

const getEmailHtml = async (templateName: string, templateVarieables: Record<string, string> = {}) => {
  const hbrTemplates = await getHbrTemplates()
  const hbrTemplate = hbrTemplates[templateName]
  const html = hbrTemplate(templateVarieables)
  return html
}

const sendEmail = async ({
  to,
  subject,
  templateName,
  templateVarieables = {},
}: {
  to: string
  subject: string
  templateName: string
  templateVarieables?: Record<string, any>
}) => {
  try {
    const fullTemplateVariables = {
      ...templateVarieables,
      homeUrl: env.WEBAPP_URL,
    }
    const html = await getEmailHtml(templateName, fullTemplateVariables)
    const { loggableResponse, originalResponse } = await sendEmailThroughBrevo({
      to,
      subject,
      html,
    })
    logger.info('email', 'send email', {
      to,
      subject,
      templateName,
      fullTemplateVariables,
      loggableResponse,
      originalResponse,
    })
    return { ok: true }
  } catch (error) {
    logger.error('email', error)
    return { ok: false }
  }
}

export const sendWelcomeEmail = async ({ user }: { user: Pick<User, 'nick' | 'email'> }) => {
  return await sendEmail({
    to: user.email,
    subject: 'Thanks For Registeration!',
    templateName: 'welcome',
    templateVarieables: { nick: user.nick, addIdeaUrl: `${getNewIdeaRoute({ abs: true })}` },
  })
}

export const sendIdeaBlockedEmail = async ({
  user,
  idea,
}: {
  user: Pick<User, 'nick' | 'email'>
  idea: Pick<Idea, 'nick'>
}) => {
  return await sendEmail({
    to: user.email,
    subject: 'Your Idea Blocked!',
    templateName: 'ideaBlocked',
    templateVarieables: { makeIdea: idea.nick },
  })
}

export const sendMostLikedIdeasEmail = async ({
  user,
  ideas,
}: {
  user: Pick<User, 'email'>
  ideas: Pick<Idea, 'nick' | 'name'>[]
}) => {
  return await sendEmail({
    to: user.email,
    subject: 'Most Liked Ideas!',
    templateName: 'mostLikedIdeas',
    templateVarieables: {
      ideas: ideas.map((idea) => ({ name: idea.name, url: getViewIdeaRoute({ abs: true, makeIdea: idea.nick }) })),
    },
  })
}
