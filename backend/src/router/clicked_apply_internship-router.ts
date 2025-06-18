import express, {Request, Response} from "express";
import {Unit} from "../unit.js";
import {isValidId} from "../model.js";
import {StatusCodes} from "http-status-codes";
import {InternshipService} from "../services/internship-service.js";
import {StudentService} from "../services/student-service.js";
import {ClickedApplyInternshipService} from "../services/clicked_apply_internships-service.js";

export const clickedApplyInternshipRouter = express.Router();

clickedApplyInternshipRouter.put("/", async (req: Request, res: Response) => {
    const {studentId, internshipId} = req.body;
    const unit: Unit = await Unit.create(false);
    const internshipService = new InternshipService(unit);
    const studentService = new StudentService(unit);

    if (!isValidId(studentId) || !(await studentService.studentExists(studentId))
        || !isValidId(internshipId) || !(await internshipService.internshipExists(internshipId))) {
        res.status(StatusCodes.BAD_REQUEST).send("Ids were not valid or corresponding data does not exist");
        return;
    }

    try {
        const clickedService = new ClickedApplyInternshipService(unit);
        const exists: boolean = await clickedService.clickedApplyInternshipExists(studentId, internshipId);
        const success: boolean = exists ? await clickedService.update(studentId, internshipId) : await clickedService.insert(studentId, internshipId);

        if (success) {
            res.status(exists ? StatusCodes.NO_CONTENT : StatusCodes.CREATED).send("clicked apply internship was created or updated");
            await unit.complete(true);
        }

    } catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete(false);
    }

});

clickedApplyInternshipRouter.get("/internship/:internshipId/clickedCount/last90Days", async (req: Request, res: Response) => {
    const internshipId: number = parseInt(req.params.internshipId);
    const unit: Unit = await Unit.create(true);
    const internshipService = new InternshipService(unit);

    if (!isValidId(internshipId) || !(await internshipService.internshipExists(internshipId))) {
        res.status(StatusCodes.BAD_REQUEST).json({"clickedCount": "0"});
        return;
    }

    try {
        const clickedService = new ClickedApplyInternshipService(unit);
        const clickedCount: number = await clickedService.getCountOfInternshipLast90Days(internshipId);

        res.status(StatusCodes.OK).json(clickedCount);
    } catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});
