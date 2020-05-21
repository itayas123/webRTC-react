const config = {
  JWT_PRIVATE_KEY: "d_myJwtSecret",
  ALLOWED_ORIGINS: ["http://localhost:3000"],
  MONGO_URL: "mongodb://127.0.0.1:27017/Itay",
  WS_URI: "ws://127.0.0.1:8888/kurento",
  DOCKER_FOLDER: "/var/lib/kurento",
  LOCAL_FOLDER: "/Desktop/Namer-Records",
  RECORD_FILE_URI: "file:///var/lib/kurento/{id}.webm",
  ALIVE_SOURCES_TIME: 10000,
};
module.exports = config;
