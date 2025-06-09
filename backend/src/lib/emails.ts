import { promises as fs } from 'fs'
import path from 'path'
import type { Idea, User } from '@prisma/client'
import fg from 'fast-glob'
import Handlebars from 'handlebars'
import _ from 'lodash'
import { sendEmailThroughBrevo } from './brevo'
import { env } from './env'

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
    console.info('send email', {
      to,
      subject,
      templateName,
      fullTemplateVariables,
      loggableResponse,
      originalResponse,
    })
    return { ok: true }
  } catch (error) {
    console.error(error)
    return { ok: false }
  }
}

export const sendWelcomeEmail = async ({ user }: { user: Pick<User, 'nick' | 'email'> }) => {
  return await sendEmail({
    to: user.email,
    subject: 'Thanks For Registeration!',
    templateName: 'welcome',
    templateVarieables: { nick: user.nick, addIdeaUrl: `${env.WEBAPP_URL}/ideas/new` },
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
