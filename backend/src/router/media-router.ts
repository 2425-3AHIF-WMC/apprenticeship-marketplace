import express from "express";
import path from "path";
import fs from "fs";
import multer, { FileFilterCallback } from "multer";
import { Unit } from "../unit.js";
import { InternshipService } from "../services/internship-service.js";
import { Request, Response } from "express";

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

const upload = multer({
    storage: multer.diskStorage({
        destination: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) {
            cb(null, path.join(mediaDir, "job-postings"));
        },
        filename: function (req: Request, file: Express.Multer.File, cb: (error: Error | null, filename: string) => void) {
            const internshipId = (req.params as any).internshipId;
            const filePath = path.join(mediaDir, "job-postings", `${internshipId}.pdf`);
            // Falls Datei existiert, löschen wir sie vor dem Speichern (optional, für Race-Condition-Sicherheit)
            if (fs.existsSync(filePath)) {
                try { fs.unlinkSync(filePath); } catch (e) { /* ignore */ }
            }
            cb(null, `${internshipId}.pdf`);
        }
    }),
    fileFilter: function (req: Request, file: Express.Multer.File, cb: FileFilterCallback) {
        if (file.mimetype !== "application/pdf") {
            return cb(new Error("Nur PDF-Dateien erlaubt!"));
        }
        cb(null, true);
    }
});

mediaRouter.post("/upload/:internshipId", upload.single("file"), async (req: Request, res: Response) => {
    const internshipId = req.params.internshipId;
    const file = (req as Request & { file?: Express.Multer.File }).file;
    if (!internshipId || !file) {
        res.status(400).send("internshipId und Datei erforderlich");
        return;
    }
    console.log(internshipId);
    const pdfPath = `job-postings/${internshipId}.pdf`;
    const unit = await Unit.create(false);
    try {
        const service = new InternshipService(unit);
        const updated = await service.updatePdfPath(parseInt(internshipId), pdfPath);
        if (updated) {
            await unit.complete(true);
            res.status(200).json({ pdfPath });
        } else {
            await unit.complete(false);
            res.status(404).send("Internship nicht gefunden oder Update fehlgeschlagen");
        }
    } catch (e) {
        await unit.complete(false);
        res.status(500).send("Fehler beim Update: " + e);
    }
});

export { mediaRouter }; 