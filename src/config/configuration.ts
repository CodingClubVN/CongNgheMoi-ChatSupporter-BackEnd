export default () => ({
    port: parseInt(process.env.PORT, 10) || 5000,
    database: {
      url: process.env.URL_MONGO_DB
    }
  });