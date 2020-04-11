const config = {
  JWT_PRIVATE_KEY: "d_myJwtSecret",
  MONGO_URL: "mongodb://127.0.0.1:27017/Itay",
  WS_URI: "ws://127.0.0.1:8888/kurento",
  RECORD_FILE_URI: "file:///tmp/try-home.webm",
  ALIVE_SOURCES_TIME: 35000,
};
//file_uri: "https://namer-records.s3.eu-central-1.amazonaws.com/"

module.exports = config;
