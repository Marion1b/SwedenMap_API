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
                path: '/register',
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
        const user: UsersAttributes = req.body;
        try{
            //check if email not already in db
            const emailExists : UsersAttributes| null = await this.user.findOneByEmail(user.email);
            if(emailExists){
                res.status(400).json({message: 'Email already registered'});
                return
            }

            //check if username not already in db
            const usernameExists: UsersAttributes | null = await this.user.findOneByUsername(user.username);
            if(usernameExists){
                res.status(400).json({message: 'Username already used'});
            }

            //create user
            const newUser = await this.user.create(user);
            if(!newUser){
                res.status(400).json({message: 'Failed to create new user'});
                return
            };

            //response user created
            res.status(201).json({
                message: 'user created',
                user: await this.user.findOneById(newUser.userId)
            })
            return
        }catch(error){
            console.error(error);
            res.status(500).json({message: 'Internal Server Error'});
            return;
        }
    }
}