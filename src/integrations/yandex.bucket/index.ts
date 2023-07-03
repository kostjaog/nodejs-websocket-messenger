import { v4 as uuidv4 } from 'uuid';
import AWS from './aws.config';
import { AWS_BUCKET_NAME } from '../../core/config';

const client = new AWS.S3({
  endpoint: 'https://storage.yandexcloud.net',
});

export const getSignedUrl = async ({
  type,
}: GetSignedUrlInput): Promise<GetSignedUrlResponse> => {
  const action = 'putObject';
  const objectKey = await uuidv4();

  const params = {
    Bucket: AWS_BUCKET_NAME,
    Key: objectKey,
    ContentType: type,
    Expires: Number(10000),
    ACL: 'public-read',
  };

  const signedURL: string = await new Promise((resolve, reject) => {
    client.getSignedUrl(action, params, (err, url) => {
      if (err) {
        reject(err);
      } else {
        resolve(url);
      }
    });
  });

  return {
    signedURL,
    objectURL: `https://${AWS_BUCKET_NAME}.storage.yandexcloud.net/${params.Key}`,
    expensive: params.Expires,
  };
};
export interface GetSignedUrlInput {
  fileName?: string | null;
  type?: string | null;
}

export interface UploadFileInput {
  fileName: string;
  type: string;
}

export interface GetSignedUrlResponse {
  signedURL: string;
  objectURL: string;
  expensive: number;
}
