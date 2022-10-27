export default () => ({
    port: parseInt(process.env.PORT, 10) || 5000,
    database: {
      url: process.env.URL_MONGO_DB
    },
    jwt: {
      secret: process.env.SECRET_TOKEN,
      expiresIn: process.env.EXPIRESIN_TOKEN
    },
    firebase: {
      projectId: process.env.FIREBASE_PROJECT_ID,
      privateKey: process.env.FIREBASE_PRIVATE_KEY,
      clientEmail: process.env.FIREBASE_EMAIL_CLIENT
    }
  });