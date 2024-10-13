const mongoose = require("mongoose");

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

const url = `${DB_PROTO}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then((res) => {
    console.log("MongoDB connected");
  })
  .catch((error) => {
    console.log("error connecting to MongoDB:", error.message);
  });

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  number: { type: String, required: true },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Person", personSchema);
