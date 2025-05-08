import express, {Request, Response} from "express";
import {Pool} from "pg";
import {Unit} from "../unit.js";
import {StatusCodes} from "http-status-codes";
import {InternshipService} from "../services/internship-service.js";

export const internshipRouter = express.Router();

internshipRouter.get("/current", async (req, res) => {
    const unit: Unit = await Unit.create(true);
    try{
        const service = new InternshipService(unit);

        const internship = await service.getAllCurrent();

        res.status(StatusCodes.OK).json(internship);

    } catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});

internshipRouter.get("/", async (req, res) => {
    const unit: Unit = await Unit.create(true);
    try{
        const service = new InternshipService(unit);
        const internship = await service.getAll();
        res.status(StatusCodes.OK).json(internship);
    } catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete();
    }
});

internshipRouter.get("/:id_prop", async (req: Request, res: Response) => {
    const unit: Unit = await Unit.create(true);
    const { id_prop } = req.params;

    let id: number = parseInt(id_prop);

    if(!Number.isInteger(id) || id < 0 || id === null){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }
    try{
        const service = new InternshipService(unit);
        const internship = await service.getById(id);
        res.status(StatusCodes.OK).json(internship);
    } catch (e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);

    } finally {
        await unit.complete();
    }
});


