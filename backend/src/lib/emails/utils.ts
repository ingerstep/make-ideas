import { promises as fs } from 'fs'
import path from 'path'
import fg from 'fast-glob'
import Handlebars from 'handlebars'
import _ from 'lodash'
import { sendEmailThroughBrevo } from '../brevo'
import { env } from '../env'
import { logger } from '../logger'

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

export const sendEmail = async ({
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
