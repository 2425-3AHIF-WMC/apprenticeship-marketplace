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
        const success: boolean = await viewedService.insert(studentId, internshipId);

        if(success) {
            res.status(StatusCodes.CREATED).send("viewed internship was created");
            await unit.complete(true);
        }

    } catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete(false);
    }

});