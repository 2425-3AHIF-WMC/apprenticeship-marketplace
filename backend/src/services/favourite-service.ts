import {ServiceBase} from "./service-base.js";
import {Unit} from "../unit.js";

export class FavouriteService extends ServiceBase {
    constructor(unit: Unit) {
        super(unit);
    }
}