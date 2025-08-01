import { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { Utils } from '../../utils/utils';
import BaseController from '../BaseControllers';
import { UserService } from './UserService';
import { UsersAttributes,UserModifyAttributes } from '../../database/models/User';
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
            },{
                path: "/update",
                method: 'put',
                handler: this.modify.bind(this),
            },{
                path: "/check-cookies",
                method: 'get',
                handler: this.checkCookies.bind(this),
            }
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
        
            res.cookie('refreshToken', refreshToken, {
                httpOnly: false, // Pour le débogage, vous pouvez désactiver httpOnly temporairement
                secure: false, // Désactivez secure en développement
                sameSite: 'lax', // Utilisez 'lax' pour le développement local
                path: '/',
                domain: 'localhost' // Assurez-vous que le domaine est correct
            });

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
            const isGoodPassword:boolean = await Utils.verifyPassword(reqPassword, user.password);

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

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure:false,
                sameSite: 'lax', 
                path:"/"
            });

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

    public async modify(
        req:Request,
        res:Response,
        next:NextFunction
    ):Promise<void>{
        const user:UserModifyAttributes = req.body;
        const userId:number = user.userId;
        const authHeader = req.headers['authorization'];
        const accessToken = authHeader && authHeader.split(' ')[1];
        const refreshToken = req.cookies["refreshToken"];

        try{
            //verify JWT
            const refreshAccessToken = Utils.refreshAccessToken(refreshToken, accessToken);
            if(!refreshAccessToken){
                res.status(400).json({message:'Error JWT'});
            }

            //check if email not already in db
            if(user.email){
                const emailExists : UsersAttributes| null = await this.user.findOneByEmail(user.email);
                if(emailExists){
                    res.status(400).json({message: 'Email already registered'});
                    return
                }
            }
            

            //check if username not already in db
            if(user.username){
                const usernameExists: UsersAttributes | null = await this.user.findOneByUsername(user.username);
                if(usernameExists){
                    res.status(400).json({message: 'Username already used'});
                }
            }
            
            //hash password
            if(user.password){
                user.password = Utils.encryptPassword(user.password);
            }

            //update user
            const updateUser = await this.user.modify(userId,user);

            if(!updateUser){
                res.status(400).json({message:'Failed to update user'});
                return;
            };

            res.status(201).json({
                message: 'user updated',
                user: await this.user.findOneById(userId),
                access_JWT: refreshAccessToken
            });

            return;

        }catch(error){
            console.error(error);
            res.status(500).json({message: 'Internal server error'});
            return;
        }
    }

    public async checkCookies(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        // Vérifiez si les cookies sont présents
        if (!req.cookies) {
            res.status(400).json({ message: 'No cookies found' });
            return;
        }

        console.log('Cookies:', req.cookies); // Affiche les cookies dans la console

        // Vérifiez si le refreshToken est présent
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            res.status(400).json({ message: 'Refresh token not found in cookies' });
            return;
        }

        // Si tout est bon, envoyez le refreshToken
        res.status(200).json({ refreshToken });
    } catch (error) {
        console.error('Error checking cookies:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}
}