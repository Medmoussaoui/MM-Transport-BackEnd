

export function loggingErrors() {
    /// Errors
    process.on("uncaughtException", async (ex) => {
        throw ex;
        /// [Implement Later] -- logger.error(ex.message, ex);

    });

    process.on("unhandledRejection", (ex) => {
        /// [Implement Later] -- logger.error((ex as Error).message, ex);
        throw ex;
    });

}
