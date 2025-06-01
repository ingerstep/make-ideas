import cn from 'classnames'
import type { FormikProps } from 'formik'
import cl from './index.module.scss'

export const Textarea = ({ name, label, formik }: { name: string; label: string; formik: FormikProps<any> }) => {
  const value = formik.values[name]
  const error = formik.errors[name] as string | undefined
  const touched = formik.touched[name]
  const disabled = formik.isSubmitting
  const invalid = touched && !!error

  return (
    <div className={cn({ [cl.field]: true, [cl.disabled]: disabled })}>
      <label className={cl.label} htmlFor={name}>
        {label}
      </label>
      <textarea
        className={cn({ [cl.input]: true, [cl.invalid]: invalid })}
        onChange={(e) => {
          void formik.setFieldValue(name, e.target.value)
        }}
        onBlur={() => {
          void formik.setFieldTouched(name)
        }}
        value={value}
        name={name}
        id={name}
        disabled={formik.isSubmitting}
      />
      {!!touched && !!error && <div className={cl.error}>{error}</div>}
    </div>
  )
}
