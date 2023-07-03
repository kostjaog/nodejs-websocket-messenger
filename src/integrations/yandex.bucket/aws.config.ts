import {
  AWS_REGION,
  AWS_USER_KEY,
  AWS_USER_SECRET_KEY,
} from '../../core/config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const AWS = require('aws-sdk');

const accessKeyId = AWS_USER_KEY;
const secretAccessKey = AWS_USER_SECRET_KEY;

AWS.config.update({ region: AWS_REGION, accessKeyId, secretAccessKey });

export default AWS;
