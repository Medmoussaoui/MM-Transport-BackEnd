import { loggingErrors } from './startup/logging';
import { routes } from './startup/routes';
import express from 'express';
import { middlewares } from './startup/mddlewares';
import { expressErrorHandler } from './startup/expressError';
import { initialPeriodicFunctions } from "./startup/schedules";
import { config } from './startup/config';


const app = express();

const env = config.get("node_env");
console.log("Env : " + env);

// Logging Errors
loggingErrors();

// Middlewares 
middlewares(app);

// Routes
routes(app);

// express Error Handler
expressErrorHandler(app);

// Schedules
initialPeriodicFunctions();

const port = process.env.PORT || 5000;

export const server = app.listen(port, () => console.log(`Server runing on port ${port} ...`));
