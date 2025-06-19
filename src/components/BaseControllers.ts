import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { RouteDefinition } from "../types/RouteDefinition";

export default abstract class BaseController {
    public abstract routes(): RouteDefinition[];

    /**
     * Global method to send API response
     * @param res
     * @param statusCodes
     */

    public send(res:Response, statusCode:number = StatusCodes.OK):void{
        res.status(statusCode).send(res.locals.data);
    }
}