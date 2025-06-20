import { zGetIdeasTrpcInput } from '@make-ideas/backend/src/router/ideas/getIdeas/input'
import InfiniteScroll from 'react-infinite-scroller'
import { Link } from 'react-router-dom'
import { useDebounceValue } from 'usehooks-ts'
import { Alert } from '../../../components/Alert'
import { Input } from '../../../components/Input'
import { layoutContentElRef } from '../../../components/Layout'
import { Loader } from '../../../components/Loader'
import { Segment } from '../../../components/Segment'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { getViewIdeaRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'
import cl from './index.module.scss'

export const AllIdeasPage = withPageWrapper({
  title: 'All Ideas',
  isTitleExact: true,
})(() => {
  const { formik } = useForm({
    initialValues: {
      search: '',
    },
    validationSchema: zGetIdeasTrpcInput.pick({ search: true }),
  })

  const debouncedValue = useDebounceValue(formik.values.search, 300)

  const { data, error, isLoading, isError, hasNextPage, fetchNextPage, isFetchingNextPage, isRefetching } =
    trpc.getIdeas.useInfiniteQuery(
      {
        search: debouncedValue[0],
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      }
    )
  return (
    <Segment title="All Ideas">
      <div className={cl.filter}>
        <Input formik={formik} label="Search" name="search" maxWidth={'100%'} />
      </div>
      {isLoading || isRefetching ? (
        <Loader type="section" />
      ) : isError ? (
        <Alert color="red">{error.message}</Alert>
      ) : !data.pages[0].ideas.length ? (
        <Alert color="brown">Nothing found by search</Alert>
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
                    >
                      Likes: {idea.likesCount}
                    </Segment>
                  </div>
                )
              })}
          </InfiniteScroll>
        </div>
      )}
    </Segment>
  )
})

AllIdeasPage.displayName = 'AllIdeasPage'
