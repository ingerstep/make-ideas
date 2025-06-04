import InfiniteScroll from 'react-infinite-scroller'
import { Link } from 'react-router-dom'
import { Alert } from '../../../components/Alert'
import { layoutContentElRef } from '../../../components/Layout'
import { Loader } from '../../../components/Loader'
import { Segment } from '../../../components/Segment'
import { getViewIdeaRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'
import cl from './index.module.scss'

export const AllIdeasPage = () => {
  const { data, error, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isRefetching } =
    trpc.getIdeas.useInfiniteQuery(
      {
        limit: 2,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    )
  return (
    <Segment title="All Ideas">
      {isLoading || isRefetching ? (
        <Loader type="section" />
      ) : isError ? (
        <Alert color="red">{error.message}</Alert>
      ) : (
        <div className={cl.ideas}>
          <InfiniteScroll
            threshold={250}
            loadMore={() => {
              if (!isFetchingNextPage && hasNextPage) {
                void fetchNextPage()
              }
            }}
            hasMore={hasNextPage}
            loader={
              <div className={cl.more} key="loader">
                <Loader type="section" />
              </div>
            }
            getScrollParent={() => layoutContentElRef.current}
            useWindow={(layoutContentElRef.current && getComputedStyle(layoutContentElRef.current).overflow) !== 'auto'}
          >
            {data.pages
              .flatMap((page) => page.ideas)
              .map((idea) => {
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
          </InfiniteScroll>
        </div>
      )}
    </Segment>
  )
}
