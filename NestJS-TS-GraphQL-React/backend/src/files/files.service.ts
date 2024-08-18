import { Injectable } from '@nestjs/common';
import { FileUpload } from 'graphql-upload'
import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { v2 as cloudinary } from 'cloudinary';
import { join } from 'path';
import { createWriteStream } from 'fs';

@Injectable()
export class FilesService {
    private readonly s3Client: S3Client
    private AWSRegion: string

    constructor() {
        this.AWSRegion = `eu-west-1`
        this.s3Client = new S3Client({ region: this.AWSRegion })

        cloudinary.config({ 
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
            api_key: process.env.CLOUDINARY_API_KEY, 
            api_secret: process.env.CLOUDINARY_API_SECRET
        });
    }
    
    
    async AWSfileUpload(file: FileUpload) {
        try {
            // s3 functionality
            const key = `fileLocationFolder/${Date.now()}-${file?.filename}`
            const { createReadStream, mimetype} = file;

            const fileStream = createReadStream()

            const upload = new Upload({
                client: this.s3Client,
                params: {
                  Bucket: `S3BucketName`,
                  Key: key,
                  Body: fileStream,
                  ContentType: mimetype,
                },
              })

            await upload.done()
            return true
        } catch (error) {
            console.log('Error occurred on AWSfileUpload-files.service: ', error.message)
        }
    }

    async CloudinaryfileUpload(file) {
        try {
            // cloudinary functionality
            // some other
            // upload_large
            // upload 
            var upload_stream= cloudinary.uploader.upload_stream({folder: 'file-series', tags: 'files-series'},function(err,image) {
                if (err){ console.warn(err);}
                console.log("* ", image.public_id);
                console.log("* ", image.url);
              });

            const { createReadStream } = file;

            const fileStream = createReadStream()

            await fileStream.pipe(upload_stream);
            return true
        } catch (error) {
            console.log('Error occurred on CloudinaryfileUpload-files.service: ', error.message)
            return false
        }
    }

    async LocalfileUpload(file: FileUpload) {
        try {
            // Save to local root folder functionality
            const localFilePath = join(process.cwd(), 'uploads', `${Date.now()}-${file?.filename}`)

            return new Promise<void>((resolve, reject) => {
                const writeStream = createWriteStream(localFilePath)

                file.createReadStream().pipe(writeStream).on('finish', () => resolve).on('error', (error) => {
                    console.error('Error occurred - ', error.message)
                    reject(error)
                })
            })
        } catch (error) {
            console.log('Error occurred on LocalfileUpload-files.service: ', error.message)
        }
    }
}
