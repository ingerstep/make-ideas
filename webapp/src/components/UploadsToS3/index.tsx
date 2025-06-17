import { getS3UploadName, getS3UploadUrl } from '@make-ideas/shared/src/s3'
import cn from 'classnames'
import { type FormikProps } from 'formik'
import { useRef, useState } from 'react'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { useUploadToS3 } from '../UploadToS3'
import cl from './index.module.scss'

export const UploadsToS3 = ({ label, name, formik }: { label: string; name: string; formik: FormikProps<any> }) => {
  const value = formik.values[name] as string[]
  const error = formik.errors[name] as string | undefined
  const touched = formik.touched[name] as boolean
  const invalid = touched && !!error
  const disabled = formik.isSubmitting

  const inputEl = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  const { uploadToS3 } = useUploadToS3()

  return (
    <div className={cn({ [cl.field]: true, [cl.disabled]: disabled })}>
      <input
        className={cl.fileInput}
        type="file"
        disabled={loading || disabled}
        accept="*"
        multiple
        ref={inputEl}
        onChange={({ target: { files } }) => {
          void (async () => {
            setLoading(true)
            try {
              if (files?.length) {
                const newValue = [...value]
                await Promise.all(
                  Array.from(files).map(async (file) => {
                    await uploadToS3(file).then(({ s3Key }) => {
                      newValue.push(s3Key)
                    })
                  })
                )
                void formik.setFieldValue(name, newValue)
              }
            } catch (err: any) {
              console.error(err)
              formik.setFieldError(name, err.message)
            } finally {
              void formik.setFieldTouched(name, true, false)
              setLoading(false)
              if (inputEl.current) {
                inputEl.current.value = ''
              }
            }
          })()
        }}
      />
      <label className={cl.label} htmlFor={name}>
        {label}
      </label>
      {!!value?.length && (
        <div className={cl.uploads}>
          {value.map((s3Key) => (
            <div key={s3Key} className={cl.upload}>
              <a className={cl.uploadLink} target="_blank" href={getS3UploadUrl(s3Key)} rel="noreferrer">
                {getS3UploadName(s3Key)}
              </a>
              <button
                type="button"
                className={cl.delete}
                onClick={() => {
                  void formik.setFieldValue(
                    name,
                    value.filter((deletedS3Key) => deletedS3Key !== s3Key)
                  )
                }}
              >
                <Icon className={cl.deleteIcon} name="delete" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className={cl.buttons}>
        <Button
          type="button"
          onClick={() => inputEl.current?.click()}
          loading={loading}
          disabled={loading || disabled}
          color="green"
        >
          {value ? 'Upload more' : 'Upload'}
        </Button>
      </div>
      {invalid && <div className={cl.error}>{error}</div>}
    </div>
  )
}
