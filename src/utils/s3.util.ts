// S3 utility for uploading files and returning S3 URLs
import AWS = require('aws-sdk');
import { v4 as uuidv4 } from 'uuid';

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

export async function uploadToS3(fileBuffer: Buffer, fileName: string, folder: string): Promise<string> {
  const key = `${folder}/${uuidv4()}-${fileName}`;
  const params = {
    Bucket: process.env.AWS_S3_BUCKET_NAME as string,
    Key: key,
    Body: fileBuffer,
    ACL: 'public-read',
    ContentType: 'image/jpeg', // or detect from fileName
  };
  await s3.upload(params).promise();
  return `https://${params.Bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}
