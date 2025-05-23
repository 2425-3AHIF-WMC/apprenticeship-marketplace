import express from 'express';
import {Request, Response} from 'express';
import {Pool} from 'pg';
import {Unit} from '../unit.js';
import {FavouriteService} from "../services/favourite-service.js";
import {StatusCodes} from "http-status-codes";

export const favouriteRouter = express.Router();


const pool = new Pool({
    user: "postgres",
    host: "postgres",
    database: "cruddb",
    password: "postgres",
    port: 5432,
});

favouriteRouter.post("/create", async (req: Request, res: Response) => {

});

favouriteRouter.delete("/delete", async (req: Request, res: Response) => {

});