import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import BaseController from '../BaseControllers';
import { UserService } from './UserService';
import { UsersAttributes } from '../../database/models/User';
import { RouteDefinition } from '../../types/RouteDefinition';

export default class UserController extends BaseController{
    private user: UserService;
    public basePath: string = 'users';

    constructor() {
        super();
        this.user = new UserService();
    }

    public routes(): RouteDefinition[]{
        return[
            {
                path:'/', 
                method: 'get', 
                handler: this.getUsers.bind(this),
            },/*{
                path: '/:id',
                method: 'get',
                handler: this.getUser.bind(this),
            },*/{
                path: '/',
                method:'post',
                handler: this.createUser.bind(this),
            }/*,{
                path: "/:id",
                method: "put",
                handler: this.updateUser.bind(this),
            },{
                path: ':id',
                method: 'delete',
                handler: this.deleteUser.bind(this),
            }*/
        ];
    }

    /**
     * @param req
     * @param res
     * @param next
     */

    public async getUsers(
        req:Request,
        res:Response,
        next:NextFunction,
    ): Promise<void>{
        try{
            const users : UsersAttributes[] = await this.user.getAll();
            res.locals.data = users;
            this.send(res);
        }catch(err){
            next(err);
        }
    }

    /**
     * @param req
     * @param res
     * @param next
     */

    public async createUser(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{
        try{
             const user : UsersAttributes = await this.user.create({
                "username":"banana",
                'password':"aaaa",
                'email':'banane@mail.com',
                'country':'france'
            });
            res.locals.data={
                user,
            };
            super.send(res, StatusCodes.CREATED);
        }catch(error){
            next(error);
        }
    }
}