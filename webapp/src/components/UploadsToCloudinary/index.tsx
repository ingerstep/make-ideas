import {
  type CloudinaryUploadPresetName,
  type CloudinaryUploadTypeName,
  getCloudinaryUploadUrl,
} from '@make-ideas/shared/src/cloudinary'
import cn from 'classnames'
import { type FormikProps } from 'formik'
import { useRef, useState } from 'react'
import { Button } from '../Button'
import { Icon } from '../Icon'
import { useUploadToCloudinary } from '../UploadToCloudinary'
import cl from './index.module.scss'

export const UploadsToCloudinary = <TTypeName extends CloudinaryUploadTypeName>({
  label,
  name,
  formik,
  type,
  preset,
}: {
  label: string
  name: string
  formik: FormikProps<any>
  type: TTypeName
  preset: CloudinaryUploadPresetName<TTypeName>
}) => {
  const value = formik.values[name] as string[]
  const error = formik.errors[name] as string | undefined
  const touched = formik.touched[name] as boolean
  const invalid = touched && !!error
  const disabled = formik.isSubmitting

  const inputEl = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  const { uploadToCloudinary } = useUploadToCloudinary(type)

  return (
    <div className={cn({ [cl.field]: true, [cl.disabled]: disabled })}>
      <input
        className={cl.fileInput}
        type="file"
        disabled={loading || disabled}
        accept="image/*"
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
                    await uploadToCloudinary(file).then(({ publicId }) => {
                      newValue.push(publicId)
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
        <div className={cl.previews}>
          {value.map((publicId) => (
            <div key={publicId} className={cl.previewPlace}>
              <button
                type="button"
                className={cl.delete}
                onClick={() => {
                  void formik.setFieldValue(
                    name,
                    value.filter((deletedPublicId) => deletedPublicId !== publicId)
                  )
                }}
              >
                <Icon className={cl.deleteIcon} name="delete" />
              </button>
              <img className={cl.preview} alt="" src={getCloudinaryUploadUrl(publicId, type, preset)} />
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
          {value?.length ? 'Upload more' : 'Upload'}
        </Button>
      </div>
      {invalid && <div className={cl.error}>{error}</div>}
    </div>
  )
}
