import express from "express";
import dotenv from "dotenv";
import Connection from "./database/db.js";
import Router from "./routes/route.js";
import bodyParser from "body-parser";
import cors from "cors";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/", Router);

app.post("/api", (req, res) => {
  // Handle the incoming JSON data
  const jsonData = req.body;
  console.log(jsonData);
  res.json({ message: "Data received successfully" });
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () =>
  console.log(`Server is running successfully on PORT ${PORT}`)
);

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

const URL =
  process.env.MONGODB_URI ||
  `mongodb+srv://${USERNAME}:${PASSWORD}@teamsdb.gzmz1yf.mongodb.net/?retryWrites=true&w=majority&appName=TeamsDB`;

Connection(URL);
