import * as express from 'express'
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"

const s3Client = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_KEY,
    secretAccessKey: process.env.AWS_SECRET,
  },
  region: "us-east-1",
});

export const presign = async (req: any, res: any, next: any) => {
  try {
    let params = {
      Bucket: "shantsai",
      Key: req.body.key,
    };

    let command = new PutObjectCommand(params);
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    res.json({ url: signedUrl });
  } catch (err) {
    next(err)
  }
}

const router = express.Router()

router.post('/', presign)

export default router
