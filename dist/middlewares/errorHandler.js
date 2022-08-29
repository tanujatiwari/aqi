"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = ((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const defaultError = 'Something went wrong. Please try again later.';
    res.status(statusCode).json({
        messageToDev: err.message || defaultError,
        messageToClient: err.clientMessage || defaultError
    });
    next();
});
exports.default = errorHandler;
