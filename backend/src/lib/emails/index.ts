import { getViewIdeaRoute } from '@make-ideas/webapp/src/lib/routes'
import type { Idea, User } from '@prisma/client'
import _ from 'lodash'
import { getNewIdeaRoute } from '@make-ideas/webapp/src/lib/routes'
import { sendEmail } from './utils'

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
