import type { TrpcRouterOutput } from '@make-ideas/backend/src/router/types'
import { canBlockIdeas, canEditIdea } from '@make-ideas/backend/src/utils/can'
import { format } from 'date-fns'
import { useParams } from 'react-router-dom'
import { Alert } from '../../../components/Alert'
import { Button, LinkButton } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Segment } from '../../../components/Segment'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { type ViewIdeaRouteParams, getEditIdeaRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'
import cl from './index.module.scss'

const LikeButton = ({ idea }: { idea: NonNullable<TrpcRouterOutput['getIdea']['idea']> }) => {
  const trpcUtils = trpc.useUtils()
  const setIdeaLike = trpc.setIdeaLike.useMutation({
    onMutate: ({ isLikedByMe }) => {
      const oldGetIdeaData = trpcUtils.getIdea.getData({ makeIdea: idea.nick })

      if (oldGetIdeaData?.idea) {
        const newGetIdeaData = {
          ...oldGetIdeaData,
          idea: {
            ...oldGetIdeaData.idea,
            isLikedByMe,
            likesCount: oldGetIdeaData.idea.likesCount + (isLikedByMe ? 1 : -1),
          },
        }
        trpcUtils.getIdea.setData({ makeIdea: idea.nick }, newGetIdeaData)
      }
    },
    onSuccess: () => {
      void trpcUtils.getIdea.invalidate({ makeIdea: idea.nick })
    },
  })

  return (
    <button
      className={cl.likeButton}
      onClick={() => {
        void setIdeaLike.mutateAsync({ ideaId: idea.id, isLikedByMe: !idea.isLikedByMe })
      }}
    >
      {idea.isLikedByMe ? 'Unlike' : 'Like'}
    </button>
  )
}

const BlockIdea = ({ idea }: { idea: NonNullable<TrpcRouterOutput['getIdea']['idea']> }) => {
  const blockIdea = trpc.blockIdea.useMutation()
  const trpcUtils = trpc.useUtils()
  const { alertProps, buttonProps, formik } = useForm({
    onSubmit: async () => {
      await blockIdea.mutateAsync({ ideaId: idea.id })
      await trpcUtils.getIdea.refetch({ makeIdea: idea.nick })
    },
  })

  return (
    <form onSubmit={formik.handleSubmit}>
      <FormItems>
        <Alert {...alertProps} />
        <Button color="red" {...buttonProps}>
          Block Idea
        </Button>
      </FormItems>
    </form>
  )
}

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
  showLoaderOnFetching: false,
})(({ idea, me }) => {
  return (
    <Segment title={idea.name} description={idea.description}>
      <div className={cl.createdAt}>Created at: {format(idea.createdAt, 'yyyy-MM-dd')}</div>
      <div className={cl.author}>
        Author: {idea.author.nick}
        {idea.author.name ? ` (${idea.author.name})` : ''}
      </div>
      <div className={cl.text} dangerouslySetInnerHTML={{ __html: idea.text }} />
      <div className={cl.likes}>
        Likes: {idea.likesCount}
        {me && (
          <>
            <br />
            <LikeButton idea={idea} />
          </>
        )}
      </div>
      {canEditIdea(me, idea) && (
        <div className={cl.editButton}>
          <LinkButton to={getEditIdeaRoute({ makeIdea: idea.nick })}>Edit Idea</LinkButton>
        </div>
      )}
      {canBlockIdeas(me) && (
        <div className={cl.blockIdea}>
          <BlockIdea idea={idea} />
        </div>
      )}
    </Segment>
  )
})

ViewIdeaPage.displayName = 'ViewIdeaPage'
