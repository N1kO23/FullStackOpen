require("dotenv").config();

const DB_USERNAME = process.env.DB_USERNAME;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST = process.env.DB_HOST;
const DB_PROTO = process.env.DB_PROTO || "mongodb+srv"; // Defaulting to atlas based proto

if (!DB_USERNAME) {
  console.error("database username not defined");
  process.exit(1);
}
if (!DB_PASSWORD) {
  console.error("database password not defined");
  process.exit(1);
}
if (!DB_HOST) {
  console.error("database host not defined");
  process.exit(1);
}

const MONGODB_URI = `${DB_PROTO}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/?retryWrites=true&w=majority`;

const PORT = process.env.PORT || 3001; // The listening port of the backend

module.exports = {
  MONGODB_URI,
  PORT,
};
