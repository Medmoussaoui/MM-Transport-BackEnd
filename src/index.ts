import * as config from "./startup/config";
import { loggingErrors } from './startup/logging';
import { routes } from './startup/routes';
import express from 'express';
import { middlewares } from './startup/mddlewares';
import { expressErrorHandler } from './startup/expressError';
import { startUpDebug } from "./debug";

startUpDebug("---> Start up " + config.config.get("name"));

const app = express();

// Logging Errors
loggingErrors();

// Middlewares 
middlewares(app);

// Routes
routes(app);

// express Error Handler
expressErrorHandler(app);


export const server = app.listen(8000, () => console.log('Server runing on port 8000 ...'));
