import * as admin from 'firebase-admin';

export class FirebaseUploadUtil {
    constructor(){}

    async uploadFile(file) {
        admin.initializeApp({
            credential: admin.credential.cert('app-chat-coding-club-firebase-adminsdk-3rhx6-8b26d0fa98.json'),
            storageBucket: 'app-chat-coding-club.appspot.com'
        });
        const bucket = admin.storage().bucket();
        const blob = bucket.file(file.originalname);
        console.log(blob.name);
        
    
        const blobWriter = await blob.createWriteStream({
            metadata: {
                contentType: file.mimetype,
                metadata: {
                    firebaseStorageDownloadTokens: "coding-club"
                }
            }
        })
        
        blobWriter.on('error', (err) => {
            console.log(err)
        })
        
        blobWriter.on('finish', () => {
        })
        
        blobWriter.end(file.buffer);
    }
    getUrlUpload(fileName: string): string {
        return 'https://firebasestorage.googleapis.com/v0/b/app-chat-coding-club.appspot.com/o/' + fileName + '?alt=media&token=coding-club';
    } 
}