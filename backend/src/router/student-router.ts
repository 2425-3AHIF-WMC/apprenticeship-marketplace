import express from 'express';
import {Request, Response} from 'express';
import {Pool} from 'pg';
import {Unit} from '../unit.js';
import {StudentService} from "../services/student-service.js";
import {IStudent} from "../model.js";
import {StatusCodes} from "http-status-codes";

export const studentRouter = express.Router();

const pool = new Pool({
    user: "postgres",
    host: "postgres",
    database: "cruddb",
    password: "postgres",
    port: 5432,
});

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


// NOTE: temporary code, so we can see how it will look like

// CREATE
studentRouter.post("/items", async (req: Request, res: Response) => {
    const { name } = req.body;
    const result = await pool.query("INSERT INTO items (name) VALUES ($1) RETURNING *", [name]);
    res.json(result.rows[0]);
});

// READ
studentRouter.get("/items", async (req: Request, res: Response) => {
    const result = await pool.query("SELECT * FROM items");
    res.json(result.rows);
});

// UPDATE
studentRouter.put("/items/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    const result = await pool.query("UPDATE items SET name = $1 WHERE id = $2 RETURNING *", [name, id]);
    res.json(result.rows[0]);
});

// DELETE
studentRouter.delete("/items/:id", async (req: Request, res: Response) => {
    const { id } = req.params;
    await pool.query("DELETE FROM items WHERE id = $1", [id]);
    res.json({ message: "Item deleted" });
});