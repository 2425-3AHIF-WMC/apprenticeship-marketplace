import express from 'express';
import {Request, Response} from 'express';
import {Pool} from 'pg';
import {Unit} from '../unit.js';
import {FavouriteService} from "../services/favourite-service.js";
import {StatusCodes} from "http-status-codes";
import {IFavourite} from "../model";

export const favouriteRouter = express.Router();


const pool = new Pool({
    user: "postgres",
    host: "postgres",
    database: "cruddb",
    password: "postgres",
    port: 5432,
});

favouriteRouter.post("/create", async (req: Request, res: Response) => {
    const unit: Unit = await Unit.create(true);
    const internship_id : number = parseInt(req.body.internship_id);
    const student_id : number = parseInt(req.body.student_id);

    if(!Number.isInteger(internship_id) || internship_id < 0 || internship_id === null
        || !Number.isInteger(student_id) || student_id < 0 || student_id === null){
        res.status(StatusCodes.BAD_REQUEST).send("Id was not valid");
        return;
    }

    try {
        const doesInternshipIdExist = await unit.prepare(`SELECT internship_id 
                                                                                FROM internship
                                                                                WHERE internship_id=$1`
            ,[internship_id]);
        const doesStudentIdExist = await unit.prepare(`SELECT student_id 
                                                                            FROM student
                                                                            WHERE student_id=$1`
            ,[student_id]);
        let rowNumbI = doesInternshipIdExist.rowCount?? -1;
        let rowNumbS = doesStudentIdExist.rowCount?? -1;
        if(rowNumbI <= 0 || rowNumbS <= 0){
            res.status(StatusCodes.BAD_REQUEST).send("Id does not exist");
            return;
        }

        let id_s = student_id.toString();
        let id_i = internship_id.toString();

        let timestamp: Date = new Date();
        let favourite: IFavourite = {
            student_id: id_s,
            internship_id: id_i,
            added: timestamp
        }

        const service = new FavouriteService(unit);
        const addedSuccessful = await service.insertFavourite(favourite);

        if(addedSuccessful != -1){
            res.status(StatusCodes.OK).send("deleted successfully");
            return;


        } else  {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("could not be deleted");
            return;

        }

    }catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
        return;
    }finally {
        await unit.complete();
    }
});

favouriteRouter.delete("/delete", async (req: Request, res: Response) => {
    const unit: Unit = await Unit.create(true);
    const internship_id : number = parseInt(req.body.internship_id);
    const student_id : number = parseInt(req.body.student_id);

    if(!Number.isInteger(internship_id) || internship_id < 0 || internship_id === null
        || !Number.isInteger(student_id) || student_id < 0 || student_id === null){
        res.status(StatusCodes.BAD_REQUEST).send("Id was not valid");
        return;
    }

    try {
        const doesInternshipIdExist = await unit.prepare(`SELECT internship_id 
                                                                                FROM internship
                                                                                WHERE internship_id=$1`
                                                                          ,[internship_id]);
        const doesStudentIdExist = await unit.prepare(`SELECT student_id 
                                                                            FROM student
                                                                            WHERE student_id=$1`
                                                                       ,[student_id]);
        let rowNumbI = doesInternshipIdExist.rowCount?? -1;
        let rowNumbS = doesStudentIdExist.rowCount?? -1;
        if(rowNumbI <= 0 || rowNumbS <= 0){
            res.status(StatusCodes.BAD_REQUEST).send("Id does not exist");
            return;
        }

        const doesFavouriteExist = await unit.prepare(`SELECT *
                                                                            FROM favourite
                                                                            WHERE internship_id=$1
                                                                            AND student_id=$2`
                                                                        , [internship_id, student_id]);

        let rowNumbF = doesFavouriteExist.rowCount?? -1;

        if(rowNumbF <= 0){
            res.status(StatusCodes.BAD_REQUEST).send("Id does not exist");
            return;
        }

        const service = new FavouriteService(unit);
        const deletedSuccessful = await service.deleteFavourite(internship_id, student_id);
        if(deletedSuccessful != -1){
            res.status(StatusCodes.OK).send("deleted successfully");
            return;


        } else  {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("could not be deleted");
            return;

        }

    }catch (e) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
        return;
    }finally {
        await unit.complete();
    }
});