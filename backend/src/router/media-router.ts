import express from "express";
import path from "path";
import fs from "fs";
import multer, {FileFilterCallback} from "multer";
import {Unit} from "../unit.js";
import {InternshipService} from "../services/internship-service.js";
import {Request, Response} from "express";
import {CompanyService} from "../services/company-service.js";

const mediaRouter = express.Router();
const mediaDir = path.resolve("/app/media");
const companyLogoDir = path.join(mediaDir, "company-logos");

mediaRouter.get("/", (req, res) => {
    res.send("Hello World");
});

const uploadCompanyLogo = multer({
    storage: multer.diskStorage({
        destination: (_req, _file, cb) => cb(null, companyLogoDir),
        filename: (req, file, cb) => {
            const companyId = req.params.companyId;
            const ext = path.extname(file.originalname).toLowerCase();
            cb(null, `${companyId}${ext}`);
        },
    }),
    fileFilter: (_req, file, cb) => {
        const allowed = ["image/png", "image/jpeg", "image/svg+xml"];
        if (!allowed.includes(file.mimetype)) {
            return cb(new Error("Nur JPG, PNG oder SVG erlaubt"));
        }
        cb(null, true);
    },
});

mediaRouter.get("/company-logo/:companyId", (req, res) => {
    const companyId = req.params.companyId;
    const files = fs.readdirSync(companyLogoDir);
    const file = files.find((f) => f.startsWith(companyId + "."));
    if (!file) {
        res.status(404).send("Logo nicht gefunden");
        return;
    }

    const fullPath = path.join(companyLogoDir, file);
    res.sendFile(fullPath);
});

mediaRouter.post("/company-logo/:companyId", uploadCompanyLogo.single("file"), async (req, res) => {
        const companyId = req.params.companyId;

        if (!req.file) {
            res.status(400).send("Keine Datei hochgeladen");
            return;
        }
        if (!companyId) {
            res.status(400).send("Company Id fehlt");
            return;
        }
        const file = (req as Request & { file?: Express.Multer.File }).file;

        const companyLogoPath = `company-logos/${companyId}.png`;
        const unit = await Unit.create(false);
        try {
            const service = new CompanyService(unit);
            const updated = await service.updateLogoPath(parseInt(companyId), companyLogoPath);
            if (updated) {
                await unit.complete(true);
                res.status(200).send("Logo erfolgreich hochgeladen");
            } else {
                await unit.complete(false);
                res.status(404).send("Company nicht gefunden oder Update fehlgeschlagen");
            }
        } catch (e) {
            await unit.complete(false);
            res.status(500).send("Fehler beim Update: " + e);
        }
    }
);

mediaRouter.delete("/company-logo/:companyId", async (req, res) => {
    const companyId = req.params.companyId;
    const files = fs.readdirSync(companyLogoDir);
    const file = files.find((f) => f.startsWith(companyId + "."));
    if (!file) {
        res.status(404).send("Logo nicht gefunden");
        return;
    }

    const fullPath = path.join(companyLogoDir, file);
    const unit = await Unit.create(false);

    try {
        fs.unlinkSync(fullPath); // Datei löschen

        const service = new CompanyService(unit);
        const updated = await service.updateLogoPath(parseInt(companyId), null);

        if (updated) {
            await unit.complete(true);
            res.status(200).send("Logo gelöscht und Pfad zurückgesetzt");
        } else {
            await unit.complete(false);
            res.status(404).send("Firma nicht gefunden oder Datenbank-Update fehlgeschlagen");
        }
    } catch (e) {
        await unit.complete(false);
        res.status(500).send("Fehler beim Löschen oder Datenbank-Update: " + e);
    }
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
                try {
                    fs.unlinkSync(filePath);
                } catch (e) { /* ignore */
                }
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
            res.status(200).json({pdfPath});
        } else {
            await unit.complete(false);
            res.status(404).send("Internship nicht gefunden oder Update fehlgeschlagen");
        }
    } catch (e) {
        await unit.complete(false);
        res.status(500).send("Fehler beim Update: " + e);
    }
});

export {mediaRouter};