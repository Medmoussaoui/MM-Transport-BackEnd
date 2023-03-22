

export function loggingErrors() {
    /// Errors
    process.on("uncaughtException", (ex) => {
        /// [Implement Later] -- logger.error(ex.message, ex);
        console.log('Catch Error Thrown')
    });

    process.on("unhandledRejection", (ex) => {
        /// [Implement Later] -- logger.error((ex as Error).message, ex);
        console.log("Catch unhadle Rejection");
    });
}