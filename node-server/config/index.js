const config = {
  JWT_PRIVATE_KEY: "d_myJwtSecret",
  MONGO_URL: "mongodb://127.0.0.1:27017/Itay",
  WS_URI: "ws://127.0.0.1:8888/kurento",
  RECORD_FILE_URI: "file:///var/lib/kurento/{id}.webm",
  ALIVE_SOURCES_TIME: 35000,
};
module.exports = config;
