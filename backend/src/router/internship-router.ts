import express, {Request, Response} from "express";
import {Unit} from "../unit.js";
import {StatusCodes} from "http-status-codes";
import {InternshipService} from "../services/internship-service.js";
import {IInternship, InternshipUIProps} from "../model";

export const internshipRouter = express.Router();

internshipRouter.get("/current", async (req, res) => {
    const unit: Unit = await Unit.create(true);
    try{
        const service = new InternshipService(unit);

        const internship = await service.getAllCurrent();

        res.status(StatusCodes.OK).json(internship);

    } catch (e) {
        res.sendStatus(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
    } finally {
        await unit.complete();
    }
});

internshipRouter.put("/change", async (req, res) => {
    const unit: Unit = await Unit.create(true);
    const id: number = req.body.internship_id === undefined ? -1 : parseInt(req.body.internship_id);

    const {title, description, min_year,
        internship_creation_timestamp, salary, application_end,
        location_id, clicks, worktype_id, internship_duration_id,
        internship_application_link} = req.body;

    if(!title || !description || !min_year
        || !internship_creation_timestamp || !salary || !application_end
        || !location_id || !clicks || !worktype_id || !internship_duration_id
        || !internship_application_link){
        res.status(StatusCodes.BAD_REQUEST).send("Data was not valid");
    }

    try{

        const doesLocationExist = await unit.prepare(`SELECT location_id
                                                                           FROM site
                                                                           WHERE location_id=$1`,[location_id]);
        const doesWorktypeExist = await unit.prepare(`SELECT worktype_id
                                                                           FROM worktype
                                                                           WHERE worktype_id=$1`, [worktype_id]);
        const doesInternshipDurationExist = await unit.prepare(`SELECT internship_duration_id
                                                                                     FROM internship_duration
                                                                                     WHERE internsip_duration_id=$1`, [internship_duration_id]);

        if((doesLocationExist.rowCount??0) <1 || (doesWorktypeExist.rowCount??0) <1 || (doesInternshipDurationExist.rowCount??0) < 1){
            res.status(StatusCodes.BAD_REQUEST).send("Parameter für Fremdschlüssel nicht existierend");
            return;

        }

        if(id === -1){
            let internship: IInternship = {
                title, description, min_year,
                internship_creation_timestamp, salary, application_end,
                location_id, clicks, worktype_id, internship_duration_id,
                internship_application_link
            }

            const service = new InternshipService(unit);
            const addedSuccessful = await service.newInternship(internship);

            if(addedSuccessful != -1){
                res.status(StatusCodes.CREATED).send("Internship added successfully");
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internship could not be added");
                return;

            }
        } else {
            const doesIdExist = await unit.prepare(`SELECT internship_id 
                                                                    FROM internship
                                                                    WHERE internship_id=$1`,[id]);
            let rowNumb = doesIdExist.rowCount?? -1;
            if(rowNumb <= 0){
                res.status(StatusCodes.BAD_REQUEST).send("Id does not");
                return;
            }

            let internship: IInternship = {
                title, description, min_year,
                internship_creation_timestamp, salary, application_end,
                location_id, clicks, worktype_id, internship_duration_id,
                internship_application_link
            }

            const service = new InternshipService(unit);
            const addedSuccessful = await service.updateInternship(internship);

            if(addedSuccessful != -1){
                res.status(StatusCodes.CREATED).send("Internship updated successfully");
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Internship could not be added");
                return;

            }
        }
    }catch (e) {

    }finally {

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
        return;

    } finally {
        await unit.complete();
    }
});

internshipRouter.delete("/delete/:id", async (req, res) => {
    const unit: Unit = await Unit.create(true);
    const id : number = parseInt(req.params.id);


    if(!Number.isInteger(id) || id < 0 || id === null){
        res.status(StatusCodes.BAD_REQUEST).send("Id was not valid");
        return;
    }

    try {
        const doesIdExist = await unit.prepare(`SELECT internship_id 
                                                                    FROM internship
                                                                    WHERE internship_id=$1`,[id]);
        let rowNumb = doesIdExist.rowCount?? -1;
        if(rowNumb <= 0){
            res.status(StatusCodes.BAD_REQUEST).send("Id does not exist");
            return;
        }

        const service = new InternshipService(unit);

        const addedSuccessful = await service.deleteInternship(id);

        if(addedSuccessful != -1){
            res.status(StatusCodes.OK).send("deleted successfully");
            return;


        } else  {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("could not be deleted");
            return;

        }

    }catch (e){
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).send(e);
        return;

    }finally {
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