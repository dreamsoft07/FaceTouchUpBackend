import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import avatarRoutes from "./routes/avatar.js"; // Note the `.js` extension
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";


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

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
