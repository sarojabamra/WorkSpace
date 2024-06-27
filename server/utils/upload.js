import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";
import multer from "multer";

dotenv.config();

const USERNAME = process.env.DB_USERNAME;
const PASSWORD = process.env.DB_PASSWORD;

const storage = new GridFsStorage({
  url: `mongodb+srv://${USERNAME}:${PASSWORD}@teamsdb.gzmz1yf.mongodb.net/?retryWrites=true&w=majority&appName=TeamsDB`,
  options: { useNewUrlParser: true },
  file: (request, file) => {
    const match = [
      "image/png",
      "image/jpg",
      "image/jpeg",
      "application/pdf",
      "text/plain",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    if (match.indexOf(file.mimeType) === -1)
      return `${Date.now()}-${file.originalname}`;

    return {
      bucketName: "photos",
      filename: `${Date.now()}-${file.originalname}`,
    };
  },
});

export default multer({ storage });
