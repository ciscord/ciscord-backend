import { mutationField, arg, stringArg, nullable, nonNull, list } from 'nexus'
import { processUpload, deleteFromAws } from '../../utils/fileApi'
import { getUserId } from '../../utils'

export const uploadFile = mutationField('uploadFile', {
  type: 'UFile',
  args: { file: nonNull(arg({ type: 'File' })) },
  resolve: async (parent, { file }: { file: File }, ctx) => {
    const userId = getUserId(ctx)
    if (!userId || !file) {
      throw new Error('nonexistent user')
    }

    const { Key, filename, mimetype, encoding, filesize } = await processUpload(file)

    const result = await ctx.prisma.file.create({
      data: {
        Key,
        filename,
        mimetype,
        encoding,
        filesize: String(filesize),
        uploader: { connect: { id: userId } }
      }
    })

    return result
  }
})

export const uploadFiles = mutationField('uploadFiles', {
  type: 'UFile',
  args: {
    files: arg({ type: nonNull(list(nonNull('File'))) })
  },
  resolve: async (parent, { files }, ctx) => {
    const userId = getUserId(ctx)
    if (!userId) {
      throw new Error('nonexistent user')
    }

    const resultList = await Promise.all(
      files.map(async (file: FileUpload) => {
        const { Key, filename, mimetype, encoding } = await processUpload(file)

        const result = await ctx.prisma.file.create({
          data: {
            Key,
            filename,
            mimetype,
            encoding,
            uploader: { connect: { id: userId } }
          }
        })

        return result
      })
    )

    return resultList
  }
})

export const deleteFile = mutationField('deleteFile', {
  type: 'String',
  args: { Key: stringArg() },
  resolve: async (parent, { Key }, ctx) => {
    const userId = getUserId(ctx)

    if (!userId) {
      throw new Error('nonexistent user')
    }

    const file = await ctx.prisma.file.findMany({
      where: {
        Key,
        uploader: {
          id: userId
        }
      }
    })

    if (!file[0]) {
      throw new Error('Invalid permissions, you must be an author of this file to delete it.')
    }

    const res = await deleteFromAws(Key)

    if (res) {
      await ctx.prisma.file.delete({
        where: {
          Key
        }
      })
    }

    return Key
  }
})
