import { GraphQLUpload } from "graphql-upload";
import { mutationField, arg, stringArg } from "nexus";
import { processUpload, deleteFromAws } from "../../utils/fileApi";
import { getUserId } from "../../utils";

export const uploadFile = mutationField("uploadFile", {
  type: "File",
  args: { file: arg({ type: "Upload", nullable: true }) },
  resolve: async (parent, { file }, ctx) => {
    const userId = getUserId(ctx);
    if (!userId) {
      throw new Error("nonexistent user");
    }

    const { Key, filename, mimetype, encoding, filesize } = await processUpload(file);

    const result = await ctx.prisma.file.create({
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
  list: true,
  args: { files: arg({ type: "Upload", required: true, list: true }) },
  resolve: async (parent, { files }, ctx) => {
    const userId = getUserId(ctx);
    if (!userId) {
      throw new Error("nonexistent user");
    }

    const resultList = await Promise.all(
      files.map(async (file) => {
        const { Key, filename, mimetype, encoding } = await processUpload(file);

        const result = await ctx.prisma.file.create({
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
  resolve: async (parent, { Key }, ctx) => {
    const userId = getUserId(ctx);

    const file = await ctx.prisma.file.findMany({
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
      await ctx.prisma.file.delete({
        where: {
          Key
        }
      });
    }

    return Key;
  }
});
