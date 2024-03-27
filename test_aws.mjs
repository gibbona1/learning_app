import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { writeFileSync } = require('fs');

const client = new S3Client({region: process.env.REACT_APP_AWS_DEFAULT_REGION,
    credentials: {accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
                  secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY
     }});
async function downloadObject(bucketName, objectKey, outputPath) {
    try {
        const response = await client.send(new GetObjectCommand({
            Bucket: bucketName,
            Key: objectKey,
        }));
        const bodyContent = await streamToBuffer(response.Body);
        writeFileSync(outputPath, bodyContent);
        console.log(`File downloaded successfully to ${outputPath}`);
    } catch (err) {
        console.error("Error downloading file:", err);
    }
}

function streamToBuffer(stream) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        stream.on('data', (chunk) => chunks.push(chunk));
        stream.on('end', () => resolve(Buffer.concat(chunks)));
        stream.on('error', reject);
    });
}

downloadObject("my-audio-bucket-2024", "CARNSOREMET_20220707_080200_93_96.wav", "./downloaded_file.wav");