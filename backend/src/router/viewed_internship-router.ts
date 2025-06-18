import express, {Request, Response} from "express";
import {Unit} from "../unit.js";
import {isValidId} from "../model.js";
import {StatusCodes} from "http-status-codes";
import {InternshipService} from "../services/internship-service.js";
import {StudentService} from "../services/student-service.js";
import {ViewedInternshipService} from "../services/viewed_internship-service.js";

export const viewedInternshipRouter = express.Router();

viewedInternshipRouter.put("/", async (req: Request, res: Response) => {
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
        const viewedService = new ViewedInternshipService(unit);
        const exists: boolean = await viewedService.viewedInternshipExists(studentId, internshipId);
        const success: boolean = exists ? await viewedService.update(studentId, internshipId) : await viewedService.insert(studentId, internshipId);

        if (success) {
            res.status(exists ? StatusCodes.NO_CONTENT : StatusCodes.CREATED).send("viewed internship was created or updated");
            await unit.complete(true);
        }

    } catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete(false);
    }

});

viewedInternshipRouter.get("/:internshipId/viewedCount", async (req: Request, res: Response) => {
    const internshipId: number = parseInt(req.params.internshipId);
    const unit: Unit = await Unit.create(true);
    const internshipService = new InternshipService(unit);

    if (!isValidId(internshipId) || !(await internshipService.internshipExists(internshipId))) {
        res.status(StatusCodes.BAD_REQUEST).json({"viewedCount": "0"});
        return;
    }

    try {
        const viewedService = new ViewedInternshipService(unit);
        const viewedCount: number = await viewedService.getCountOfInternship(internshipId);

        res.status(StatusCodes.OK).json(viewedCount);
    } catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});

viewedInternshipRouter.get("/:studentId/countLast30Days", async (req: Request, res: Response) => {
    const studentId: number = parseInt(req.params.studentId);
    const unit: Unit = await Unit.create(true);
    const studentService = new StudentService(unit);

    if (!isValidId(studentId) || !(await studentService.studentExists(studentId))) {
        res.status(StatusCodes.BAD_REQUEST).json({"viewedCount": "0"});
    }

    try {
        const viewedService = new ViewedInternshipService(unit);
        const viewedCount: number = await viewedService.getCountOfStudentLast30Days(studentId);

        res.status(StatusCodes.OK).json(viewedCount);
    } catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});