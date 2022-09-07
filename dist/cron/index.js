"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const axios_1 = __importDefault(require("axios"));
const redis_1 = __importDefault(require("../redis"));
const mock_1 = require("../db/mock");
class Cron {
    constructor(databaseService) {
        this.lockCron = () => __awaiter(this, void 0, void 0, function* () {
            // console.log(await client.del('cron:lock'))
            const res = yield redis_1.default.set('cron:lock', `${process.pid}`, { NX: true });
            if (res !== "OK") {
                return console.log('Already locked. returning from process id', process.pid);
            }
            console.log('Job started by process id', process.pid);
            const allStations = yield this.databaseService.getAllStations();
            for (let i = 0; i < allStations.length; i++) {
                const geopoint = allStations[i].geopoint;
                const { x: lat, y: lon } = geopoint;
                const apiResponse = yield axios_1.default.get(`http://api.waqi.info/feed/geo:${lat};${lon}/?token=${process.env.WEATHER_API_KEY}`);
                const aqi = apiResponse.data.data.aqi;
                const currTime = new Date().toISOString();
                yield this.databaseService.insertAqi(allStations[i].id, aqi, currTime);
            }
            console.log('inserting aqi...');
            this.releaseKey('cron:lock', process.pid);
        });
        this.releaseKey = (key, value) => __awaiter(this, void 0, void 0, function* () {
            const keyValue = yield redis_1.default.get(key);
            const valueToCompare = value.toString();
            if (keyValue === null) {
                return;
            }
            if (keyValue === valueToCompare && value != null) {
                yield redis_1.default.del(key);
            }
            else {
                return console.log('Incorrect key value pair given');
            }
        });
        this.databaseService = databaseService;
    }
}
// const cronObject = new Cron(new DatabaseQueries())
const cronObject = new Cron(new mock_1.MockDatabaseQueries());
const job = node_cron_1.default.schedule('* * * * *', () => __awaiter(void 0, void 0, void 0, function* () {
    cronObject.lockCron();
}));
exports.default = job;
