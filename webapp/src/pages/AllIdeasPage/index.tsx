import { Link } from 'react-router-dom'
import { Segment } from '../../components/Segment'
import { getViewIdeaRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
import cl from './index.module.scss'

export const AllIdeasPage = () => {
  const { data, error, isLoading, isFetching, isError } = trpc.getIdeas.useQuery()

  if (isLoading || isFetching) {
    return <span>Loading...</span>
  }
  if (isError) {
    return <span>Error: {error.message}</span>
  }

  return (
    <Segment title="All Ideas">
      <div className={cl.ideas}>
        {data.ideas.map((idea) => {
          return (
            <div key={idea.nick} className={cl.idea}>
              <Segment
                size={2}
                description={idea.description}
                title={
                  <Link className={cl.ideaLink} to={getViewIdeaRoute({ makeIdea: idea.nick })}>
                    {idea.name}
                  </Link>
                }
              />
            </div>
          )
        })}
      </div>
    </Segment>
  )
}
