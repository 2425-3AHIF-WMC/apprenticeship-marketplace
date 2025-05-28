import express, {Router, Request, Response} from "express";
import {isValidId} from "../model.js";
import {Unit} from "../unit.js";
import {StatusCodes} from "http-status-codes";
import {AdminService} from "../services/admin-service.js";

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