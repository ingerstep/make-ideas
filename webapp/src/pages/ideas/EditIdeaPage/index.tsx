import { zUpdateIdeaTrpcInput } from '@make-ideas/backend/src/router/ideas/updateIdea/input'
import { canEditIdea } from '@make-ideas/backend/src/utils/can'
import { pick } from '@make-ideas/shared/src/pick'
import { useNavigate } from 'react-router-dom'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Segment } from '../../../components/Segment'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { getViewIdeaRoute } from '../../../lib/routes'
import { trpc } from '../../../lib/trpc'
import { UploadsToCloudinary } from '../../../components/UploadsToCloudinary'
import { UploadToS3 } from '../../../components/UploadToS3'
import { UploadsToS3 } from '../../../components/UploadsToS3'

export const EditIdeaPage = withPageWrapper({
  authorizedOnly: true,
  useQuery: () => {
    const { makeIdea } = getViewIdeaRoute.useParams()
    return trpc.getIdea.useQuery({ makeIdea })
  },
  setProps: ({ queryResult, ctx, checkExists, checkAccess }) => {
    const idea = checkExists(queryResult.data.idea, 'Idea not found')
    checkAccess(canEditIdea(ctx.me, idea), 'An idea can only be edited by its author')
    return { idea }
  },
  title: ({ idea }) => `Edit Idea "${idea.name}"`,
})(({ idea }) => {
  const navigate = useNavigate()
  const updateIdea = trpc.updateIdea.useMutation()
  const { formik, alertProps, buttonProps } = useForm({
    initialValues: pick(idea, ['name', 'nick', 'description', 'text', 'images', 'certificate', 'documents']),
    validationSchema: zUpdateIdeaTrpcInput.omit({ ideaId: true }),
    onSubmit: async (values) => {
      await updateIdea.mutateAsync({ ideaId: idea.id, ...values })
      navigate(getViewIdeaRoute({ makeIdea: values.nick }))
    },
    resetOnSuccess: false,
    showValidationAlert: true,
  })

  return (
    <Segment title={`Edit Idea: ${idea.nick}`}>
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input label="Name" name="name" formik={formik} />
          <Input label="Nick" name="nick" formik={formik} />
          <Input label="Description" name="description" maxWidth={500} formik={formik} />
          <Input label="Text" name="text" formik={formik} />
          <UploadsToCloudinary label="Images" name="images" type="image" preset="preview" formik={formik} />
          <UploadToS3 label="Certificate" name="certificate" formik={formik} />
          <UploadsToS3 label="Documents" name="documents" formik={formik} />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Update Idea</Button>
        </FormItems>
      </form>
    </Segment>
  )
})

EditIdeaPage.displayName = 'EditIdeaPage'
