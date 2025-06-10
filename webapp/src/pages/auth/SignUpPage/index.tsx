import { zSignUpTrpcInput } from '@make-ideas/backend/src/router/auth/signUp/input'
import Cookies from 'js-cookie'
import { zPasswordsMustBeTheSame, zStringRequired } from '../../../../../shared/src/zod'
import { Alert } from '../../../components/Alert'
import { Button } from '../../../components/Button'
import { FormItems } from '../../../components/FormItems'
import { Input } from '../../../components/Input'
import { Segment } from '../../../components/Segment'
import { useForm } from '../../../lib/form'
import { withPageWrapper } from '../../../lib/pageWrapper'
import { trpc } from '../../../lib/trpc'

export const SignUpPage = withPageWrapper({
  redirectAuthorized: true,
  title: 'Sign Up',
})(() => {
  const trpcUtils = trpc.useUtils()
  const signUp = trpc.signUp.useMutation()
  const { formik, alertProps, buttonProps } = useForm({
    initialValues: {
      nick: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: zSignUpTrpcInput
      .extend({
        confirmPassword: zStringRequired,
      })
      .superRefine(zPasswordsMustBeTheSame('password', 'confirmPassword')),
    onSubmit: async (values) => {
      const { token } = await signUp.mutateAsync(values)
      Cookies.set('token', token, { expires: 99999 })
      void trpcUtils.invalidate()
    },
    resetOnSuccess: false,
  })

  return (
    <Segment title="Sign Up">
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input name="nick" label="Nick" formik={formik} />
          <Input name="email" label="E-mail" formik={formik} />
          <Input name="password" type="password" label="Password" formik={formik} />
          <Input type="password" name="confirmPassword" formik={formik} label="Confirm Password" />
          <Alert {...alertProps} />
          <Button {...buttonProps}>Sign Up</Button>
        </FormItems>
      </form>
    </Segment>
  )
})

SignUpPage.displayName = 'SignUpPage'
