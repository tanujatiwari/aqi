"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const index_1 = __importDefault(require("./routes/index"));
const errorHandler_1 = __importDefault(require("./middlewares/errorHandler"));
const os_1 = __importDefault(require("os"));
const cluster_1 = __importDefault(require("cluster"));
const index_2 = __importDefault(require("./cron/index"));
const totalCpus = os_1.default.cpus().length;
if (cluster_1.default.isMaster) {
    console.log(`Number of CPUs is ${totalCpus}`);
    console.log(`Master is running on process...`, process.pid);
    for (let i = 0; i < totalCpus; i++) {
        cluster_1.default.fork();
    }
    cluster_1.default.on("exit", (worker, code, signal) => {
        console.log(`worker ${worker.process.pid} died`);
        cluster_1.default.fork();
    });
}
const app = (0, express_1.default)();
app.use(express_1.default.json());
console.log(`Worker started on process...`, process.pid);
index_2.default.start();
app.use('/', index_1.default);
app.use(errorHandler_1.default);
const port = process.env.PORT || 3000;
if (process.env.NODE_ENV !== 'test') {
    app.listen(port, () => {
        console.log(`Server started on port ${port} ${process.pid}`);
    });
}
exports.default = app;
