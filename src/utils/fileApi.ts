import { Stream } from 'stream'
const uuid = require('uuid/v1')
import { S3, AWSError } from 'aws-sdk'

const bucketName = 'shantsai'
const awsRegion = 'us-east-2'

const s3 = new S3({
  accessKeyId: process.env.AWS_KEY,
  secretAccessKey: process.env.AWS_SECRET,
  region: awsRegion,
  params: {
    Bucket: bucketName
  }
})

export async function processUpload(file: File) {
  console.log(file, '==file')
  const stream = await file.text()
  const Key = await uploadToAws(stream, file.name)
  const filesize = await sizeOfFile(Key, bucketName)

  return { Key, filename: file.name, mimetype: file.type, encoding: 'blob', filesize }
}

export async function uploadToAws(stream: string, filename: string) {
  const res = await s3
    .upload({
      Key: bucketName + uuid() + filename,
      ACL: 'public-read',
      Body: stream,
      ContentDisposition: 'attachment; filename ="' + filename + '"'
    })
    .promise()
    .catch((e: any) => console.log('ERROR', e))

  return res.key
}

export async function deleteFromAws(Key: string) {
  const res = await new Promise((resolve, reject) => {
    s3.deleteObject({ Key, Bucket: bucketName }, (e: AWSError, data: S3.DeleteObjectOutput) => {
      if (e) reject(e)

      resolve(data)
    })
  })

  return res
}

export const sizeOfFile = (key: string, bucket: string): Promise<number> => {
  return s3
    .headObject({ Key: key, Bucket: bucket })
    .promise()
    .then((res) => res.ContentLength)
}
