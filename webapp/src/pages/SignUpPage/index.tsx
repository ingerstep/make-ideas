import { zSignUpTrpcInput } from '@make-ideas/backend/src/router/signUp/input'
import { useFormik } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import Cookies from 'js-cookie'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import z from 'zod'
import { Alert } from '../../components/Alert'
import { Button } from '../../components/Button'
import { FormItems } from '../../components/FormItems'
import { Input } from '../../components/Input'
import { Segment } from '../../components/Segment'
import { getAllIdeasRoute } from '../../lib/routes'
import { trpc } from '../../lib/trpc'
export const SignUpPage = () => {
  const navigate = useNavigate()
  const trpcUtils = trpc.useUtils()
  const [submittingError, setSubmittingError] = useState<string | null>(null)
  const signUp = trpc.signUp.useMutation()
  const formik = useFormik({
    initialValues: {
      nick: '',
      password: '',
      confirmPassword: '',
    },
    validate: withZodSchema(
      zSignUpTrpcInput
        .extend({
          confirmPassword: z.string().min(1),
        })
        .superRefine((values, ctx) => {
          if (values.password !== values.confirmPassword) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              path: ['confirmPassword'],
              message: 'Passwords must be the same',
            })
          }
        })
    ),
    onSubmit: async (values) => {
      try {
        setSubmittingError(null)
        const { token } = await signUp.mutateAsync(values)
        Cookies.set('token', token, { expires: 99999 })
        void trpcUtils.invalidate()
        navigate(getAllIdeasRoute())
      } catch (error: any) {
        setSubmittingError(error.message)
      }
    },
  })

  return (
    <Segment title="Sign Up">
      <form onSubmit={formik.handleSubmit}>
        <FormItems>
          <Input name="nick" label="Nick" formik={formik} />
          <Input name="password" type="password" label="Password" formik={formik} />
          <Input type="password" name="confirmPassword" formik={formik} label="Confirm Password" />
          {!formik.isValid && !!formik.submitCount && <Alert color="red">Some fields are reaquired</Alert>}
          {submittingError && <Alert color="red">{submittingError}</Alert>}
          <Button loading={formik.isSubmitting}>Sign Up</Button>
        </FormItems>
      </form>
    </Segment>
  )
}
