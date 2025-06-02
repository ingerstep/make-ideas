import { format } from 'date-fns'
import { useParams } from 'react-router-dom'
import { LinkButton } from '../../components/Button'
import { Segment } from '../../components/Segment'
import { getEditIdeaRoute, type ViewIdeaRouteParams } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import cl from './index.module.scss'

export const ViewIdeaPage = () => {
  const { makeIdea } = useParams() as ViewIdeaRouteParams
  const { data, error, isLoading, isFetching } = trpc.getIdea.useQuery({ makeIdea })
  const getMeResult = trpc.getMe.useQuery()

  if (isLoading || getMeResult.isLoading || isFetching || getMeResult.isFetching) {
    return <div>Loading...</div>
  }

  if (error) {
    return <span>Error: {error?.message}</span>
  }

  if (getMeResult.error) {
    return <span>Error: {getMeResult.error?.message}</span>
  }

  const idea = data.idea
  const me = getMeResult.data.me

  if (!idea) {
    return <span>Error: Idea not found</span>
  }

  if (!me) {
    return <span>Only for authorized</span>
  }

  if (isLoading || isFetching) {
    return <span>Loading...</span>
  }

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
}
