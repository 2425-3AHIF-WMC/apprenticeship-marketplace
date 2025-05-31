import express from "express";
import path from "path";
import fs from "fs";

const mediaRouter = express.Router();
const mediaDir = path.resolve("/app/media");

mediaRouter.get("/", (req, res) => {
    res.send("Hello World");
});

mediaRouter.get<{ requestedPath: string }>("/:requestedPath(.*)", (req, res) => {
    const filePath = req.params.requestedPath;
    if (!filePath) {
        res.status(400).send("Kein Dateiname angegeben");
        return;
    }
    const fullPath = path.join(mediaDir, filePath);

    // Sicherheitscheck: Datei muss im mediaDir liegen
    if (!fullPath.startsWith(mediaDir)) {
        res.status(403).send("Zugriff verweigert");
        return;
    }
    // Prüfen, ob Datei existiert und keine Directory ist
    fs.stat(fullPath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.status(404).send("Datei nicht gefunden");
            return;
        }
        res.sendFile(fullPath);
    });
});

export { mediaRouter }; 