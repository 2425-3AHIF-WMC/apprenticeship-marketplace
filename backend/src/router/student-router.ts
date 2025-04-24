import express from 'express';
import {Request, Response} from 'express';
import {Pool} from 'pg';

export const studentRouter = express.Router();

// NOTE: temporary code, so we can see how it will look like

const pool = new Pool({
    user: "postgres",
    host: "postgres",
    database: "cruddb",
    password: "password",
    port: 5432,
});

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