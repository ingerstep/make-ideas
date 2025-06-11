import { TRPCClientError } from '@trpc/client'
import { useFormik, type FormikHelpers } from 'formik'
import { withZodSchema } from 'formik-validator-zod'
import { useMemo, useState } from 'react'
import type { z } from 'zod'
import type { AlertProps } from '../components/Alert'
import type { ButtonProps } from '../components/Button'
import { sentryCaptureException } from './sentry'

export const useForm = <TZodSchema extends z.ZodTypeAny>({
  successMessage = false,
  resetOnSuccess = true,
  showValidationAlert = false,
  initialValues = {},
  validationSchema,
  onSubmit,
}: {
  initialValues?: z.infer<TZodSchema>
  validationSchema?: TZodSchema
  onSubmit?: (values: z.infer<TZodSchema>, actions: FormikHelpers<z.infer<TZodSchema>>) => Promise<any> | any
  successMessage?: string | false
  resetOnSuccess?: boolean
  showValidationAlert?: boolean
}) => {
  const [successMessageVisible, setSuccessMessageVisible] = useState(false)
  const [submittingError, setSubmittingError] = useState<Error | null>(null)

  const formik = useFormik<z.infer<TZodSchema>>({
    initialValues,
    ...(validationSchema && { validate: withZodSchema(validationSchema) }),
    onSubmit: async (values, foprmikHelpers) => {
      if (!onSubmit) {
        return
      }
      try {
        setSubmittingError(null)
        await onSubmit(values, foprmikHelpers)
        if (resetOnSuccess) {
          formik.resetForm()
        }
        setSuccessMessageVisible(true)
        setTimeout(() => {
          setSuccessMessageVisible(false)
        }, 2500)
      } catch (error: any) {
        if (!(error instanceof TRPCClientError)) {
          sentryCaptureException(error)
        }
        setSubmittingError(error as Error)
      }
    },
  })

  const alertProps = useMemo<AlertProps>(() => {
    if (submittingError) {
      return {
        hidden: false,
        children: submittingError.message,
        color: 'red',
      }
    }
    if (showValidationAlert && !formik.isValid && !!formik.submitCount) {
      return {
        hidden: false,
        children: 'Some fields are invalid',
        color: 'red',
      }
    }
    if (successMessage && successMessageVisible) {
      return {
        hidden: false,
        children: successMessage,
        color: 'green',
      }
    }
    return {
      hidden: true,
      color: 'red',
      children: null,
    }
  }, [submittingError, formik.isValid, formik.submitCount, successMessage, successMessageVisible, showValidationAlert])

  const buttonProps = useMemo<Omit<ButtonProps, 'children'>>(() => {
    return {
      loading: formik.isSubmitting,
    }
  }, [formik.isSubmitting])

  return {
    formik,
    alertProps,
    buttonProps,
  }
}
