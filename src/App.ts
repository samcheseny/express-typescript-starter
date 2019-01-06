import * as express from 'express';
import {routes} from "./routes";
import './auth/PassportConfig';
import * as createError from 'http-errors';
import * as logger from 'morgan';
import * as bodyParser from 'body-parser';

class App {

    public express;

    constructor() {
        this.express = express();
        this.mountMiddleware();
        this.mountRoutes();
    }

    private mountMiddleware(): void {
        this.express.use(logger('dev'));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({extended: false}));
    }

    private mountRoutes(): void {
        this.express.use('/api', routes);
        this.express.use((request: express.Request, response: express.Response, next: express.NextFunction) =>
            next(createError(404, 'Route not found'))
        );
    }

}

export default new App().express;
