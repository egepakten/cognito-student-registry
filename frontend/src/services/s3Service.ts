import {
  CognitoIdentityClient,
  GetIdCommand,
  GetCredentialsForIdentityCommand,
} from "@aws-sdk/client-cognito-identity";
import {
  S3Client,
  PutObjectCommand,
  ListObjectsV2Command,
} from "@aws-sdk/client-s3";

// CHANGE: Added configuration constants
// REASON: Need Identity Pool ID for credential exchange
const config = {
  region: import.meta.env.VITE_AWS_REGION || "us-east-1",
  identityPoolId: import.meta.env.VITE_IDENTITY_POOL_ID,
  userPoolId: import.meta.env.VITE_USER_POOL_ID,
  bucketName: import.meta.env.VITE_UPLOADS_BUCKET,
};

// CHANGE: Added function to get temporary AWS credentials
// REASON: These credentials have the IAM policy attached that restricts S3 access
export async function getAWSCredentials(idToken: string) {
  const cognitoIdentity = new CognitoIdentityClient({ region: config.region });

  // Step 1: Get Identity ID from token
  const getIdResponse = await cognitoIdentity.send(
    new GetIdCommand({
      IdentityPoolId: config.identityPoolId,
      Logins: {
        [`cognito-idp.${config.region}.amazonaws.com/${config.userPoolId}`]:
          idToken,
      },
    })
  );

  const identityId = getIdResponse.IdentityId;

  // Step 2: Get temporary credentials for this identity
  const credentialsResponse = await cognitoIdentity.send(
    new GetCredentialsForIdentityCommand({
      IdentityId: identityId,
      Logins: {
        [`cognito-idp.${config.region}.amazonaws.com/${config.userPoolId}`]:
          idToken,
      },
    })
  );

  return {
    identityId, // This is the user's unique folder name!
    credentials: {
      accessKeyId: credentialsResponse.Credentials!.AccessKeyId!,
      secretAccessKey: credentialsResponse.Credentials!.SecretKey!,
      sessionToken: credentialsResponse.Credentials!.SessionToken!,
    },
  };
}

// CHANGE: Added direct S3 upload with user-specific path
// REASON: Files are uploaded to /students/{identityId}/* automatically
export async function uploadFileToS3(
  file: File,
  idToken: string,
  userRole: "student" | "professor" | "admin"
) {
  // Get credentials (includes identityId)
  const { identityId, credentials } = await getAWSCredentials(idToken);

  // Create S3 client with temporary credentials
  const s3Client = new S3Client({
    region: config.region,
    credentials,
  });

  // Build user-specific path
  // e.g., "students/us-east-1:abc123/homework.pdf"
  const roleFolder =
    userRole === "student"
      ? "students"
      : userRole === "professor"
      ? "professors"
      : "admins";
  const key = `${roleFolder}/${identityId}/${file.name}`;

  // Upload file
  await s3Client.send(
    new PutObjectCommand({
      Bucket: config.bucketName,
      Key: key,
      Body: file,
      ContentType: file.type,
    })
  );

  return {
    success: true,
    key,
    url: `https://${config.bucketName}.s3.${config.region}.amazonaws.com/${key}`,
  };
}

// CHANGE: Added function to list user's own files
// REASON: The IAM policy only allows listing their own folder
export async function listMyFiles(idToken: string, userRole: string) {
  const { identityId, credentials } = await getAWSCredentials(idToken);

  const s3Client = new S3Client({
    region: config.region,
    credentials,
  });

  const roleFolder =
    userRole === "student"
      ? "students"
      : userRole === "professor"
      ? "professors"
      : "admins";

  const response = await s3Client.send(
    new ListObjectsV2Command({
      Bucket: config.bucketName,
      Prefix: `${roleFolder}/${identityId}/`,
    })
  );

  return response.Contents || [];
}
