import { NextFunction, Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Utils } from '../../utils/utils';
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
            },{
                path: '/login',
                method: 'post',
                handler: this.login.bind(this),
            },{
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

            //hash password
            user.password = Utils.encryptPassword(user.password);

            //create user
            const newUser = await this.user.create(user);
            if(!newUser){
                res.status(400).json({message: 'Failed to create new user'});
                return
            };

            //create access token
            const accessToken = Utils.generateAccessJWT(newUser.userId);
            //create refresh token
            const refreshToken = Utils.generateRefreshJWT(newUser.userId);

            if(!accessToken || !refreshToken){
                res.status(400).json({message: 'Could not generate web token'});
                return;
            }

            //add refreshToken to user
            await this.user.updateRefreshToken(refreshToken, newUser.userId);
        

            //response user created
            res.status(201).json({
                message: 'user created',
                user: await this.user.findOneById(newUser.userId),
                access_JWT: accessToken
            })
            return
        }catch(error){
            console.error(error);
            res.status(500).json({message: 'Internal Server Error'});
            return;
        }
    }

    public async login(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{
        const reqEmail:string = req.body.email;
        const reqPassword:string = req.body.password;

        try{
            //get user informations
            const user : UsersAttributes |null = await this.user.findOneByEmailLogin(reqEmail);
            if(!user){
                res.status(400).json({message:'Email does not exist in db'});
                return;
            }
            const isGoodPassword:Promise<boolean> = Utils.verifyPassword(reqPassword, user.password);

            if(!isGoodPassword){
                res.status(400).json({message:'Password incorrect'});
                return;
            }

            //create access token
            const accessToken = Utils.generateAccessJWT(user.userId);
            //create refresh token
            const refreshToken = Utils.generateRefreshJWT(user.userId);

            if(!accessToken || !refreshToken){
                res.status(400).json({message : 'Could not generate web token'});
                return;
            }

            //add refresh token to user
            await this.user.updateRefreshToken(refreshToken, user.userId);

            //return user authentified
            res.status(201).json({
                message:'User loged in',
                user: await this.user.findOneById(user.userId),
                access_JWT: accessToken
            });
        }catch(error){
            console.error(error);
            res.status(500).json({message:'Internal server error'});
        }
    }
}