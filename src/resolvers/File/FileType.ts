import { objectType } from 'nexus'
import { Message, User } from '../index'
// import { GraphQLUpload } from "graphql-upload";

// export const Upload = GraphQLUpload;

export const File = objectType({
  name: 'File',
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
