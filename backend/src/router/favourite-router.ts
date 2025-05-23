import express from 'express';
import {Request, Response} from 'express';
import {Pool} from 'pg';
import {Unit} from '../unit.js';
import {FavouriteService} from "../services/favourite-service.js";
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