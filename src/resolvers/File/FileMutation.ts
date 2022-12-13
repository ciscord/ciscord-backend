import { FileUpload, GraphQLUpload } from "graphql-upload";
import { mutationField, arg, stringArg, nullable, nonNull, list } from "nexus";
import { processUpload, deleteFromAws } from "../../utils/fileApi";
import { getUserId } from "../../utils";
import { File } from '../index'
import { Upload } from '../Others'

export const uploadFile = mutationField("uploadFile", {
  type: 'File',
  args: { file: nullable(arg({ type: Upload })) },
  resolve: async (parent, { file }, Context) => {
    const userId = getUserId(Context);
    if (!userId) {
      throw new Error("nonexistent user");
    }

    const { Key, filename, mimetype, encoding, filesize } = await processUpload(file);

    const result = await Context.prisma.file.create({
      data: {
        Key,
        filename,
        mimetype,
        encoding,
        filesize: String(filesize),
        uploader: { connect: { id: userId } }
      }
    });

    return result;
  }
});

export const uploadFiles = mutationField("uploadFiles", {
  type: 'File',
  args: {
    files: arg({ type: nonNull(list(nonNull(Upload))) }),
  },
  resolve: async (parent, { files }, Context) => {
    const userId = getUserId(Context);
    if (!userId) {
      throw new Error("nonexistent user");
    }

    const resultList = await Promise.all(
      files.map(async (file: FileUpload) => {
        const { Key, filename, mimetype, encoding } = await processUpload(file);

        const result = await Context.prisma.file.create({
          data: {
            Key,
            filename,
            mimetype,
            encoding,
            uploader: { connect: { id: userId } }
          }
        });

        return result;
      })
    );

    return resultList;
  }
});

export const deleteFile = mutationField("deleteFile", {
  type: "String",
  args: { Key: stringArg() },
  resolve: async (parent, { Key }, Context) => {
    const userId = getUserId(Context);

    if (!userId) {
      throw new Error("nonexistent user");
    }

    const file = await Context.prisma.file.findMany({
      where: {
        Key,
        uploader: {
          id: userId
        }
      }
    });

    if (!file[0]) {
      throw new Error(
        "Invalid permissions, you must be an author of this file to delete it."
      );
    }

    const res = await deleteFromAws(Key);

    if (res) {
      await Context.prisma.file.delete({
        where: {
          Key
        }
      });
    }

    return Key;
  }
});
