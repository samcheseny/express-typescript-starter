import * as express from 'express';
import {routes} from "./routes";

class App {

    public express;

    constructor() {
        this.express = express();
        this.mountRoutes();
    }

    private mountRoutes(): void {
        this.express.use('/api', routes);
    }

}

export default new App().express;