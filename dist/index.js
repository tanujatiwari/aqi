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
const mock_1 = __importDefault(require("./cron/mock"));
const totalCpus = os_1.default.cpus().length;
// if (cluster.isMaster) {
//     console.log(`Number of CPUs is ${totalCpus}`);
//     console.log(`Master is running on process...`, process.pid);
//     for (let i = 0; i < totalCpus; i++) {
//         cluster.fork();
//     }
//     cluster.on("exit", (worker, code, signal) => {
//         console.log(`worker ${worker.process.pid} died`);
//         cluster.fork();
//     });
// }
// else {
const app = (0, express_1.default)();
app.use(express_1.default.json());
console.log(`Worker started on process...`, process.pid);
mock_1.default.start();
app.use('/', index_1.default);
app.use(errorHandler_1.default);
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port} ${process.pid}`);
});
// }
