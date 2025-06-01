import { format } from 'date-fns'
import { useParams } from 'react-router-dom'
import { Segment } from '../../components/Segment'
import type { ViewIdeaRouteParams } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import cl from './index.module.scss'

export const ViewIdeaPage = () => {
  const { makeIdea } = useParams() as ViewIdeaRouteParams

  const { data, error, isLoading, isFetching, isError } = trpc.getIdea.useQuery({ makeIdea })

  if (isLoading || isFetching) {
    return <span>Loading...</span>
  }
  if (isError) {
    return <span>Error: {error.message}</span>
  }

  if (!data.idea) {
    return <span>Idea not found</span>
  }

  return (
    <Segment title={data.idea.name} description={data.idea.description}>
      <div className={cl.createdAt}>Created at: {format(data.idea.createdAt, 'yyyy-MM-dd')}</div>
      <div className={cl.text} dangerouslySetInnerHTML={{ __html: data.idea.text }}></div>
    </Segment>
  )
}
