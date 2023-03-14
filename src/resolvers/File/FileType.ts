import { scalarType } from 'nexus'

export const FileScalar = scalarType({
  name: 'File',
  asNexusMethod: 'file',
  description: 'The `File` scalar type represents a file upload.',
  sourceType: 'File'
})
