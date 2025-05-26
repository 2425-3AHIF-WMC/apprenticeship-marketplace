import express from 'express';
import {Request, Response} from 'express';
import {Pool} from 'pg';
import {Unit} from '../unit.js';
import {StudentService} from "../services/student-service.js";
import {IStudent, PersonType} from "../model.js";
import {StatusCodes} from "http-status-codes";

export const studentRouter = express.Router();

studentRouter.get("/favourites/:id", async (req: Request, res: Response) => {
    const unit: Unit = await Unit.create(true);
    const id : number = parseInt(req.params.id);

    if(!Number.isInteger(id) || id < 0 || id === null){
        res.status(StatusCodes.BAD_REQUEST).send("Id was not valid");
        return;
    }

    try{
        const doesIdExist = await unit.prepare(`SELECT student_id 
                                                                    FROM student
                                                                    WHERE student_id=$1`,[id]);
        let rowNumb = doesIdExist.rowCount?? -1;
        if(rowNumb <= 0){
            res.status(StatusCodes.BAD_REQUEST).send("Id does not exist");
        }

        const service = new StudentService(unit);
        const internshipIds = await service.getAllFavourites(id);

        res.status(StatusCodes.OK).json(internshipIds);

    }catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
        return;
    }finally {
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

studentRouter.post("/", async(req: Request, res: Response) => {
   const username = req.body.username;

    const unit: Unit = await Unit.create(false);

    try {
        const service = new StudentService(unit);
        const success: boolean = await service.insert(username);

        if(success){
            res.status(StatusCodes.CREATED).send("User created successfully");
            await unit.complete(true);
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Could not create user");
            await unit.complete(false);
        }
    } catch(e) {
        console.log(e);
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR);
    } finally {
        await unit.complete(false);
    }

});

studentRouter.get("/:paramId", async (req: Request, res: Response) => {
    const unit: Unit = await Unit.create(true);
    const { paramId } = req.params;
    const id:number = parseInt(paramId);

    if(isNaN(id) || id <= 0 || id === null){
        res.sendStatus(StatusCodes.BAD_REQUEST);
        return;
    }

    try{
        const service = new StudentService(unit);
        const student:IStudent = await service.getById(id);

        if(student){
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

