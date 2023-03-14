import { objectType, scalarType } from 'nexus'
import { Message, User } from '../index'

export const UFile = objectType({
  name: 'UFile',
  definition(t) {
    t.nonNull.string('encoding')
    t.nonNull.string('filename')
    t.string('filesize')
    t.nonNull.string('id')
    t.nonNull.string('Key')
    t.field('message', { type: Message })
    t.nonNull.string('mimetype')
    t.nonNull.field('uploader', { type: User })
  }
})

export const FileScalar = scalarType({
  name: 'File',
  asNexusMethod: 'file',
  description: 'The `File` scalar type represents a file upload.',
  sourceType: 'File'
})
