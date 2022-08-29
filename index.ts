import 'dotenv/config'

import express from 'express'

import publicRoutes from './routes/index'
import errorHandler from './middlewares/errorHandler'

import os from 'os';
import cluster from 'cluster';
import job from './cron/index'

import mockJob from './cron/mock'

const totalCpus = os.cpus().length

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
const app = express()
app.use(express.json())
console.log(`Worker started on process...`, process.pid);
mockJob.start()
app.use('/', publicRoutes)
app.use(errorHandler)
const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Server started on port ${port} ${process.pid}`)
});
// }
