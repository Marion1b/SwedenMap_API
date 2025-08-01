import * as bcrypt from 'bcrypt';
import jwt, {JwtPayload} from 'jsonwebtoken';

export class Utils {

    public static encryptPassword(password:string):string{
        const salt = bcrypt.genSaltSync(10);
        return bcrypt.hashSync(password, salt);
    }

    public static verifyPassword(password:string, dbPassword:string):Promise<boolean>{
        return bcrypt.compare(password, dbPassword);
    }

    public static generateAccessJWT(id:number):string|undefined{
        if(process.env.JWT_ACCESS){
            return jwt.sign({id:id}, process.env.JWT_ACCESS,{
                expiresIn:'30 minutes'
            })
        }
    }

    public static verifyAccessToken(accessToken:string):string | JwtPayload | undefined{
        if(process.env.JWT_ACCESS){
            return jwt.verify(accessToken, process.env.JWT_ACCESS);
        }
    }

    public static refreshAccessToken(refreshToken: string, accessToken:string): string | undefined {
        try {
            const verifyAccessToken = this.verifyAccessToken(accessToken);
            const payload = this.verifyRefreshJWT(refreshToken);
            if (verifyAccessToken && payload && typeof payload !== 'string' && payload.id) {
                return this.generateAccessJWT(payload.id);
            }
        } catch (error) {
            console.error('Erreur lors du rafraîchissement du token:', error);
        }
    }

    public static generateRefreshJWT(id:number):string|undefined{
        if(process.env.JWT_REFRESH){
            return jwt.sign({id:id}, process.env.JWT_REFRESH,{
                expiresIn:'7 days'
            })
        }
    }

    public static verifyRefreshJWT(refreshToken:string):string | JwtPayload | undefined {
        if(process.env.JWT_REFRESH){
            return jwt.verify(refreshToken, process.env.JWT_REFRESH);
        }
    }
}