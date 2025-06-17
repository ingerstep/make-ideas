import { cloudinaryUploadTypes } from '@make-ideas/shared/src/cloudinary'
import { getKeysAsArray } from '@make-ideas/shared/src/getKeysAsArray'
import { z } from 'zod'

export const zPrepareCloudinaryUploadTrpcInput = z.object({
  type: z.enum(getKeysAsArray(cloudinaryUploadTypes)),
})
