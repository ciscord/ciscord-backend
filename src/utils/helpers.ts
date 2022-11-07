import { deleteFromAws } from "./fileApi";

type removeFileProps = {
  filesList: string[],
  ctx: any,
  messageId: string,
}

export const removeFile = async ({filesList, ctx, messageId}: removeFileProps) => {
  await ctx.prisma.file.deleteMany({
    where: {
      message: {
        id: messageId
      }
    }
  }
  );

  filesList.map(Key => deleteFromAws(Key));
}

const ogs = require("open-graph-scraper");

export const getOpenGraphData = (url: string) => {
  return new Promise ((resolve, reject) => {
    const options = {url};
    ogs(options, function (error, results) {
      if(error) reject(error);
      resolve(results.data);
    });


  })

}

export const createRemoteAttachments = async (urlList: string[]) => {
  if (urlList && urlList.length) {
    const urlSet = new Set(urlList);
    const uniqUrlList = Array.from(urlSet);
    const requests = uniqUrlList.map(getOpenGraphData);
    const requestsResult = await Promise.all(requests);

    const remoteAttachments = {
      create: requestsResult.map(
        (requestResultItem: {
          ogTitle: string;
          ogDescription: string;
          ogUrl: string;
          ogSiteName: string;
          ogImage: any;
          ogVideo: any;
        }) => {
          const {
            ogTitle: title,
            ogDescription: description,
            ogUrl: url,
            ogSiteName: siteName,
            ogImage: {url: preview} = {},
            ogVideo: {url: videoLink} = {},
          } = requestResultItem;

          if(!url || !title) return null;

          return ({
          title,
          description,
          url,
          siteName,
          preview,
          videoLink
        })}
      ).filter((request: any) => request)
    };

    return remoteAttachments;
  }

  return {};
}