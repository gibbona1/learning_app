import { GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");


const client = new S3Client({region: process.env.REACT_APP_AWS_DEFAULT_REGION,
    credentials: {accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
                  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
     }});
async function makeSignedUrl(bucketName, objectKey) {
    try {
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
        });
        const signedUrl = await getSignedUrl(client, command, { expiresIn: 3600 });
        console.log("Signed URL:", signedUrl);
    } catch (err) {
        console.error("Error downloading file:", err);
    }
}

makeSignedUrl("my-audio-bucket-2024", "CARNSOREMET_20220707_080200_93_96.wav");