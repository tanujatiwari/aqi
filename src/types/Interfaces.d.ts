export { }

declare global {
    interface CustomError extends Error {
        statusCode?: number;
        clientMessage?: string;
    }
}