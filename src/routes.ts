import { Router } from 'express';
import { RouteDefinition } from './types/RouteDefinition';
import UserController from './components/user/UserController';

function registerControllerRoutes(routes: RouteDefinition[]):Router{
    const controllerRouter = Router();

    routes.forEach((route)=>{
        switch(route.method){
            case 'get':
                controllerRouter.get(route.path, route.handler);
                break;
            case 'post':
                controllerRouter.post(route.path, route.handler);
                break;
            default:
                throw new Error (`Unsupported HTTP method: ${route.method}`);
        }
    });
    return controllerRouter;
}

export default function registerRoutes(): Router {
    try{
        const router = Router();
        const controllers = [
            new UserController(),
        ];

        
        controllers.forEach((controller) => {
            router.use(
                `/v1/${controller.basePath}`,
                registerControllerRoutes(controller.routes()),
            );
        });
        return router;
    }catch(error){
        console.log(`error unable to register the routes: `, error);
    }
}