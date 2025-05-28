import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import avatarRoutes from "./routes/avatar.js"; // Note the `.js` extension
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Define __filename and __dirname in ES module context
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const app = express();
const port = 5000;

app.use(cors({
  origin: "http://localhost:8080",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
}));
app.use(fileUpload());
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.json());

// Routes
app.use("/avatar", avatarRoutes);

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'dist')));

// Optional: Define a route for your homepage or other pages
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
