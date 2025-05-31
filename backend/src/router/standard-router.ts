import express, {Router, Request, Response} from "express";
import {IInternShipDuration, IStudent, isValidId, IWorktype} from "../model.js";
import {Unit} from "../unit.js";
import {StatusCodes} from "http-status-codes";
import {AdminService} from "../services/admin-service.js";
import {StudentService} from "../services/student-service";
import {WorktypeService} from "../services/worktype-service.js";
import {InternshipDurationService} from "../services/internship_duration-service.js";

export const standardRouter: Router = express.Router();

standardRouter.get('/person/:id/isAdmin', async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    const unit: Unit = await Unit.create(true);

    try {
        if (isValidId(id)) {
            const service: AdminService = new AdminService(unit);
            const isAdmin: boolean = await service.existsAdmin(id);
            res.status(StatusCodes.OK).json({isAdmin});
        } else {
            res.status(StatusCodes.NOT_FOUND).send("Id was not found");
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});

standardRouter.get('/worktypes', async (req: Request, res: Response) => {
    const unit: Unit = await Unit.create(true);
    try {
        const service = new WorktypeService(unit);
        const worktypes: IWorktype[] = await service.getAll();
        res.status(StatusCodes.OK).json(worktypes);
    } catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
})

standardRouter.get('/internshipDuration', async (req : Request, res : Response) => {
    const unit: Unit = await Unit.create(true);
    try {
        const service = new InternshipDurationService(unit);
        const durations: IInternShipDuration[] = await service.getAll();
        res.status(StatusCodes.OK).json(durations);
    } catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
})