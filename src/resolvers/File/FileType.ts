import { objectType } from 'nexus'
import { GraphQLUpload } from "graphql-upload";

export const Upload = GraphQLUpload;

export const File = objectType({
  name: 'File',
  definition(t) {
    t.model.id();
    t.model.Key();
    t.model.uploader();
    t.model.filename();
    t.model.mimetype();
    t.model.message();
    t.model.filesize();
    t.model.encoding();
  }
});

