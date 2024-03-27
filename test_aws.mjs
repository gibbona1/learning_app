import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const { createWriteStream } = require('fs');
const { pipeline } = require("stream");
const { promisify } = require("util");

const pipe = promisify(pipeline);

//import {AdmZip} from "adm-zip";
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
    
            await pipe(response.Body, createWriteStream(outputPath));
            console.log(`File downloaded successfully to ${outputPath}`);
        } catch (err) {
            console.error("Error downloading file:", err);
        }
    }

downloadObject("my-audio-bucket-2024", "CARNSOREMET_20220707_080200_93_96.wav", "./downloaded_file.wav");