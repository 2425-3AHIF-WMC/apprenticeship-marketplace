import express from 'express';
import {Request, Response} from 'express';
import {Pool} from 'pg';
import {Unit} from '../unit';
import {StudentService} from "../services/student-service";
import {IStudent} from "../model";
import {StatusCodes} from "http-status-codes";

export const studentRouter = express.Router();


const pool = new Pool({
    user: "postgres",
    host: "postgres",
    database: "cruddb",
    password: "password",
    port: 5432,
});

studentRouter.get("/students", async (req: Request, res: Response) => {
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

// TODO: Verifying id und so => ghead  in service eini eig
studentRouter.get("/:id", async (req: Request, res: Response) => {
    const unit: Unit = await Unit.create(true);

    const { id } = req.params;
    const result = await pool.query("SELECT * FROM student WHERE id = $1", [id]);
    res.json(result.rows);
});

// CREATE
studentRouter.post("/items", async (req: Request, res: Response) => {
    const { name } = req.body;
    const result = await pool.query("INSERT INTO items (name) VALUES ($1) RETURNING *", [name]);
    res.json(result.rows[0]);
});


// NOTE: temporary code, so we can see how it will look like

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