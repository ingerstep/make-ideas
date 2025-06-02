import type { TrpcRouterOutput } from '@make-ideas/backend/src/router/types'
import { zUpdateIdeaTrpcInput } from '@make-ideas/backend/src/router/updateIdea/input'
import { useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import { pick } from 'lodash'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { FormItems } from '../../components/FormItems'
import { Input } from '../../components/Input'
import { Segment } from '../../components/Segment'
import { getViewIdeaRoute, type ViewIdeaRouteParams } from '../../lib/routes'
import { trpc } from '../../lib/trpc'

export const EditIdeaComponent = ({ idea }: { idea: NonNullable<TrpcRouterOutput['getIdea']['idea']> }) => {
  const navigate = useNavigate()
  const [submittingError, setSubmittingError] = useState<string | null>(null)
  const updateIdea = trpc.updateIdea.useMutation()
  const formik = useFormik({
    initialValues: pick(idea, ['name', 'nick', 'description', 'text']),
    validate: withZodSchema(zUpdateIdeaTrpcInput.omit({ ideaId: true })),
    onSubmit: async (values) => {
      try {
        setSubmittingError(null)
        await updateIdea.mutateAsync({ ideaId: idea.id, ...values })
        navigate(getViewIdeaRoute({ makeIdea: values.nick }))
      } catch (error) {
        if (error instanceof Error) {
          setSubmittingError(error.message)
        }
      }
    },
  })

  return (
    <Segment title={`Edit Idea: ${idea.nick}`}>
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Name" name="name" formik={formik} />
          <Input label="Nick" name="nick" formik={formik} />
          <Input label="Description" name="description" maxWidth={500} formik={formik} />
          <Input label="Text" name="text" formik={formik} />
          {!formik.isValid && !!formik.submitCount && <Alert color="red">Some fields are required</Alert>}
          {submittingError && <Alert color="red">{submittingError}</Alert>}
          <Button loading={formik.isSubmitting}>Update Idea</Button>
        </FormItems>
      </form>
    </Segment>
  )
}

export const EditIdeaPage = () => {
  const { makeIdea } = useParams() as ViewIdeaRouteParams
  const getIdeaResult = trpc.getIdea.useQuery({ makeIdea })
  const getMeResult = trpc.getMe.useQuery()

  if (getIdeaResult.isLoading || getMeResult.isLoading || getIdeaResult.isFetching || getMeResult.isFetching) {
    return <div>Loading...</div>
  }

  if (getIdeaResult.error) {
    return <span>Error: {getIdeaResult.error?.message}</span>
  }

  if (getMeResult.error) {
    return <span>Error: {getMeResult.error?.message}</span>
  }

  const idea = getIdeaResult.data.idea
  const me = getMeResult.data.me

  if (!idea) {
    return <span>Error: Idea not found</span>
  }

  if (!me) {
    return <span>Only for authorized</span>
  }

  if (me.id !== idea.authorId) {
    return <span>Only for author</span>
  }

  return <EditIdeaComponent idea={idea} />
}
