import { format } from 'date-fns'
import { useParams } from 'react-router-dom'
import { LinkButton } from '../../../components/Button'
import { Segment } from '../../../components/Segment'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { type ViewIdeaRouteParams, getEditIdeaRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'
import cl from './index.module.scss'

export const ViewIdeaPage = withPageWrapper({
  useQuery: () => {
    const { makeIdea } = useParams() as ViewIdeaRouteParams
    return trpc.getIdea.useQuery({ makeIdea })
  },
  checkExists: ({ queryResult }) => !!queryResult.data.idea,
  checkAccessMessage: 'Idea not found',
  setProps: ({ queryResult, ctx, checkExists }) => ({
    idea: checkExists(queryResult.data.idea, 'Idea not found'),
    me: ctx.me,
  }),
})(({ idea, me }) => {
  return (
    <Segment title={idea.name} description={idea.description}>
      <div className={cl.createdAt}>Created at: {format(idea.createdAt, 'yyyy-MM-dd')}</div>
      <div className={cl.author}>Author: {idea.author.nick}</div>
      <div className={cl.text} dangerouslySetInnerHTML={{ __html: idea.text }}></div>
      {me?.id === idea.authorId && (
        <div className={cl.editButton}>
          <LinkButton to={getEditIdeaRoute({ makeIdea: idea.nick })}>Edit Idea</LinkButton>
        </div>
      )}
    </Segment>
  )
})

ViewIdeaPage.displayName = 'ViewIdeaPage'
