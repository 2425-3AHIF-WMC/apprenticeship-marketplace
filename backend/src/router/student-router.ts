import express from 'express';
import {Request, Response} from 'express';
import {Unit} from '../unit.js';
import {StudentService} from "../services/student-service.js";
import {IStudent, isValidId} from "../model.js";
import {StatusCodes} from "http-status-codes";

export const studentRouter = express.Router();

studentRouter.get("/favourites/:id", async (req: Request, res: Response) => {
    const unit: Unit = await Unit.create(true);
    const id: number = parseInt(req.params.id);

    if (!Number.isInteger(id) || id < 0 || id === null) {
        res.status(StatusCodes.BAD_REQUEST).send("Id was not valid");
        return;
    }

    try {
        const service = new StudentService(unit);
        if (await service.studentExists(id)) {
            res.status(StatusCodes.BAD_REQUEST).send("Id does not exist");
            return;
        }
        const internshipIds = await service.getAllFavourites(id);

        res.status(StatusCodes.OK).json(internshipIds);

    } catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
        return;
    } finally {
        await unit.complete();
    }
});

studentRouter.get("/", async (req: Request, res: Response) => {
    const unit: Unit = await Unit.create(true);
    try {
        const service = new StudentService(unit);
        const students: IStudent[] = await service.getAll();
        res.status(StatusCodes.OK).json(students);
    } catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});

studentRouter.post("/", async (req: Request, res: Response) => {
    const username = req.body.username;

    const unit: Unit = await Unit.create(false);

    try {
        const service = new StudentService(unit);
        const success: boolean = await service.insert(username);

        if (success) {
            res.status(StatusCodes.CREATED).send("User creation successful");
            await unit.complete(true);
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("User creation unsuccessful");
            await unit.complete(false);
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete(false);
    }

});

studentRouter.get("/:paramId", async (req: Request, res: Response) => {
    const unit: Unit = await Unit.create(true);
    const {paramId} = req.params;
    const id: number = parseInt(paramId);

    if (isNaN(id) || id <= 0 || id === null) {
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    try {
        const service = new StudentService(unit);
        const student: IStudent = await service.getById(id);

        if (student) {
            res.status(StatusCodes.OK).json(student);
        } else {
            res.sendStatus(StatusCodes.NOT_FOUND);
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});

studentRouter.delete("/:id", async (req: Request, res: Response) => {
    const id: number = parseInt(req.params.id);
    const unit: Unit = await Unit.create(false);
    const service = new StudentService(unit);

    try {
        if (isValidId(id) && await service.studentExists(id)) {
            const success: boolean = await service.delete(id);
            if(success) {
                res.status(StatusCodes.OK).send("User deletion successful");
                await unit.complete(true);
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("User deletion unsuccessful");
                await unit.complete(false);
            }

        } else {
            res.status(StatusCodes.BAD_REQUEST).send("Id does not exist");
        }
    } catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete(false);
    }
});
