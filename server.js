import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
app.use(cors());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/public", express.static(path.join(__dirname, "public")));
app.use("/api", express.static(path.join(__dirname, "api")));

app.get("/", (req,res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(3000, () => console.log("🚀 Jahseh.API corriendo en http://localhost:3000"));
